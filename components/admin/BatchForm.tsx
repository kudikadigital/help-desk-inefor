'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Batch } from '@prisma/client'
import { updateBatch } from '@/app/admin/(dashboard)/settings/actions'

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
        // Feedback visual simples ou Toast poderia ser adicionado aqui
    }

    return (
        <div className="p-6 grid md:grid-cols-4 gap-6 items-end hover:bg-slate-800/30 transition group">
            <div className="md:col-span-4 mb-2 flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${batch.isFeatured ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {batch.name}
                </span>
                {batch.isFeatured && <span className="text-[10px] text-orange-500 font-bold animate-pulse">● DESTAQUE ATUAL</span>}
            </div>
            
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preço (Kz)</label>
                <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                />
            </div>
            <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Desconto (%)</label>
                 <input 
                    type="number" 
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                />
            </div>
            <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Vagas</label>
                 <input 
                    type="number" 
                    value={formData.slots}
                    onChange={(e) => setFormData({...formData, slots: Number(e.target.value)})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                />
            </div>
            <div>
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 w-full py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition disabled:opacity-50 group-hover:bg-slate-700"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar
                </button>
            </div>
        </div>
    )
}