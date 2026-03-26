import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildConfig,
  createCharge,
  getMethodId,
  generateMerchantTransactionId,
  // type PaymentMethod,
} from "@/lib/appypay";
import { sendPaymentConfirmationEmail } from "@/lib/brevo";

const COMPANY_NAME = process.env.PAYMENT_COMPANY_NAME || "INEFOR";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "geral@inefor.ao";
const COURSE_NAME = "Help Desk Formacao Pratica"; // Removido hífen para evitar problemas

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, batchName, amount, method, fullName, email, phone, phoneNumber } = body;

    // 1. Validação básica
    if (!batchId || !amount || !method || !fullName || !email) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    // 2. Limpeza de descrição (Crucial para evitar Erro 400 da AppyPay)
    const cleanDescription = (text: string) => {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^\w\s-]/g, "") 
        .substring(0, 50);
    };

    const config = buildConfig();
    const merchantTransactionId = generateMerchantTransactionId();
    const methodId = getMethodId(config, method);

    const payload: any = {
      merchantTransactionId,
      amount,
      currency: "AOA",
      paymentMethod: methodId,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      description: cleanDescription(`${COURSE_NAME} ${batchName}`),
    };

    // 3. Tratamento GPO
    let formattedGpoPhone = "";
    if (method === "GPO") {
      formattedGpoPhone = phoneNumber.replace(/\s+/g, "");
      if (!formattedGpoPhone.startsWith("244")) formattedGpoPhone = `244${formattedGpoPhone}`;
      payload.paymentInfo = { phoneNumber: formattedGpoPhone };
    }

    // 4. Chamada API
    const appypayResponse = await createCharge(config, payload);
    const { responseStatus } = appypayResponse;

    // 5. Status inicial (Express pode vir Success na hora, Referência vem sempre nulo/pendente)
    let status: "pending" | "paid" | "failed" = "pending";
    if (method === "GPO") {
      status = (responseStatus.successful && (responseStatus.status === "Success" || responseStatus.status === "Paid")) 
        ? "paid" : "failed";
    }

    // 6. Banco de Dados
    await prisma.payment.create({
      data: {
        batchId,
        batchName,
        amount,
        currency: "AOA",
        paymentMethod: method,
        appypayChargeId: appypayResponse.id,
        merchantTransactionId,
        status,
        fullName,
        email,
        phone,
        phoneNumber: method === "GPO" ? formattedGpoPhone : phone,
        referenceNumber: responseStatus.reference?.referenceNumber,
        referenceEntity: responseStatus.reference?.entity,
        expiresAt: responseStatus.reference?.dueDate ? new Date(responseStatus.reference.dueDate) : null,
        paidAt: status === "paid" ? new Date() : null,
      },
    });

    // 7. Atualizar Lead
    await prisma.lead.upsert({
      where: { email },
      update: { status: status === "paid" ? "MATRICULADO" : "AGUARDANDO_PAGAMENTO" },
      create: { email, name: fullName, phone, status: status === "paid" ? "MATRICULADO" : "AGUARDANDO_PAGAMENTO" },
    });

    // 8. Email (Brevo)
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      sendPaymentConfirmationEmail(brevoApiKey, {
        email, fullName, courseName: `${COURSE_NAME} - ${batchName}`, amount, method,
        referenceNumber: responseStatus.reference?.referenceNumber,
        referenceEntity: responseStatus.reference?.entity,
        referenceExpiry: responseStatus.reference?.dueDate,
        companyName: COMPANY_NAME, notifyEmail: NOTIFY_EMAIL,
      }).catch(e => console.error("Brevo Error:", e));
    }

    return NextResponse.json({
      success: true,
      method,
      status,
      ...(method === "REF" && {
        referenceNumber: responseStatus.reference?.referenceNumber,
        referenceEntity: responseStatus.reference?.entity,
        referenceExpiry: responseStatus.reference?.dueDate,
        merchantTransactionId,
      }),
    });

  } catch (error: any) {
    console.error("Charge Error:", error);
    return NextResponse.json({ error: "Erro ao processar cobrança." }, { status: 500 });
  }
}