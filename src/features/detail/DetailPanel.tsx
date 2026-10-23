import { AnimatePresence, motion } from "motion/react";
import { DetailContent } from "@/features/detail/DetailContent";
import { useAppStore } from "@/stores/useAppStore";

export function DetailPanel() {
  const selected = useAppStore((state) => state.selected);
  const selectFeature = useAppStore((state) => state.selectFeature);

  return (
    <AnimatePresence>
      {selected && (
        <motion.aside
          initial={{ opacity: 0, x: 26, scale: 0.985 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 26, scale: 0.985 }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          className="pointer-events-auto fixed bottom-5 right-5 top-[86px] z-30 hidden w-[344px] lg:flex xl:right-6 xl:w-[356px]"
        >
          <div className="flex h-full w-full flex-col rounded-[28px] border border-white/70 bg-white/42 p-1.5 shadow-[0_26px_80px_-30px_rgba(4,30,51,.45)] backdrop-blur-2xl">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[23px] border border-white/70 bg-white/[0.97] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
              <DetailContent
                selected={selected}
                onClose={() => selectFeature(null)}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
