'use client';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { label: 'Hide',         sublabel: 'Never show this phrase', icon: '⊘' },
  { label: 'Report',       sublabel: 'Flag an error',          icon: '⚑' },
  { label: 'Copy phrase',  sublabel: null,                     icon: '⎘' },
  { label: 'View details', sublabel: null,                     icon: '↗' },
];

export function MoreMenu({
  isOpen,
  onClose,
  onHide,
  onReport,
  onCopy,
  onViewDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  onHide: () => void;
  onReport: () => void;
  onCopy: () => void;
  onViewDetails: () => void;
}) {
  const actions = [onHide, onReport, onCopy, onViewDetails];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen backdrop — invisible, closes menu on tap */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onPointerUp={(e) => { e.stopPropagation(); onClose(); }}
          />

          {/* Dropdown panel — expands downward from button bottom edge */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top right' }}
            animate={{ opacity: 1, scaleY: 1, transformOrigin: 'top right' }}
            exit={{ opacity: 0, scaleY: 0, transformOrigin: 'top right' }}
            transition={{ type: 'spring', damping: 26, stiffness: 340, mass: 0.8 }}
            style={{
              position: 'absolute',
              top: '100%',      // anchored to bottom of the More button
              right: 0,         // right-aligned with the button
              marginTop: '6px',
              zIndex: 50,
              background: 'rgba(16,16,16,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '6px 0',
              minWidth: '196px',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {menuItems.map((item, i) => (
              <motion.button
                key={item.label}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  actions[i]();
                  onClose();
                }}
                whileTap={{ background: 'rgba(255,255,255,0.07)' }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '15px', opacity: 0.5, width: '20px', textAlign: 'center', flexShrink: 0 }}>
                  {item.icon}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
