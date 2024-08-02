'use client'

import React from 'react'
import { AnimatePresence, motion } from "framer-motion";

type animationWrapperProps = {
  children: React.ReactNode
  initial?: any;
  animate?: any;
  transition?: any;
  keyValue?: string;
  className?: string;
  exit?: any
}

const AnimationWrapper = ({ children, initial = { opacity: 0 }, animate = { opacity: 1 }, transition = { duration: 2 }, exit, keyValue, className }: animationWrapperProps) => {
  return (
    <AnimatePresence>
      <motion.div className={className} initial={initial} animate={animate} transition={transition} key={keyValue} exit={exit}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimationWrapper;