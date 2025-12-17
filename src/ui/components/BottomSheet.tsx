'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20" onClick={onClose}>
          <AnimatePresence>
            <motion.div
              key="sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className="w-full max-w-md rounded-t-3xl bg-white shadow-2xl"
            >
              <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
                <div className="mx-auto h-1 w-12 rounded-full bg-slate-200" />
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{title}</div>
                  <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
                    <X size={20} />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto pb-2">{children}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
