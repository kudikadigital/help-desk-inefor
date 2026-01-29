'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Batch } from '@prisma/client'
import { updateBatch } from '@/app/admin/settings/actions'

export default function BatchForm({ batch }: { batch: Batch }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        price: batch.price,
        discount: batch.discount,
        slots: batch.slots
    })

    const handleSave = async () => {
        setLoading(true)
        await updateBatch(batch.id, formData)
        setLoading(false)
        alert('Lote atualizado com sucesso!')
    }

    return (
        <div className="p-6 grid md:grid-cols-4 gap-4 items-end hover:bg-slate-50 transition">
            <div className="md:col-span-4 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${batch.isFeatured ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                    {batch.name}
                </span>
            </div>
            
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Preço Base (Kz)</label>
                <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-300 rounded text-sm" 
                />
            </div>
            <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Desconto (%)</label>
                 <input 
                    type="number" 
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-300 rounded text-sm" 
                />
            </div>
            <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Vagas</label>
                 <input 
                    type="number" 
                    value={formData.slots}
                    onChange={(e) => setFormData({...formData, slots: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-300 rounded text-sm" 
                />
            </div>
            <div>
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-2 rounded text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar
                </button>
            </div>
        </div>
    )
}