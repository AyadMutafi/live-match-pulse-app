import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  visible: boolean;
}

export function SplashScreen({ visible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <motion.span
              className="text-6xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
            >
              📡
            </motion.span>
            <h1 className="text-2xl font-bold text-foreground">Fan Pulse</h1>
            <p className="text-sm text-muted-foreground">Real-time fan sentiment</p>
            <motion.div
              className="w-16 h-1 rounded-full bg-primary/30 overflow-hidden mt-2"
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "50%" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
