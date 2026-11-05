import React, { useState } from 'react';
import { InventoryItem } from '../engine/inventory';
import { soundFx } from '../../audio/soundFx';
import { Backpack, CheckCircle, Info, Sparkles } from 'lucide-react';

interface InventoryModalProps {
  items: InventoryItem[];
  onToggleEquip: (item: InventoryItem) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  items,
  onToggleEquip,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem>(items[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-2xl w-full rounded-3xl p-6 border border-slate-700 shadow-2xl relative bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Backpack & Possessions</h3>
              <span className="text-[11px] text-slate-400">{items.length} unique financial assets & items</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          
          {/* Items Grid (Left) */}
          <div className="sm:col-span-7 grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedItem(item);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-3xl mb-1.5">{item.icon}</span>
                  <span className="text-[10px] font-bold truncate max-w-full block leading-tight">
                    {item.name}
                  </span>
                  {item.isEquipped && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Item Inspector (Right) */}
          {selectedItem && (
            <div className="sm:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{selectedItem.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedItem.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {selectedItem.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {selectedItem.description}
                </p>

                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30 text-[11px] text-blue-200">
                  <span className="font-bold block mb-0.5 text-blue-300">💡 Financial Principle:</span>
                  {selectedItem.financialFact}
                </div>
              </div>

              {selectedItem.category === 'PET' && (
                <button
                  onClick={() => {
                    soundFx.playLevelUp();
                    onToggleEquip(selectedItem);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedItem.isEquipped
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {selectedItem.isEquipped ? 'Unequip Companion' : 'Equip Companion (Follows You!)'}
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
