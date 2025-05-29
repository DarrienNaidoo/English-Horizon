import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`
  }
  return `${xp} XP`
}

export function getLevelProgress(currentXP: number, level: string): { progress: number; nextLevelXP: number } {
  const levelThresholds = {
    beginner: 500,
    intermediate: 2000,
    advanced: 5000
  }

  let nextLevelXP = levelThresholds.beginner
  if (level === "beginner") {
    nextLevelXP = levelThresholds.intermediate
  } else if (level === "intermediate") {
    nextLevelXP = levelThresholds.advanced
  }

  const progress = Math.min((currentXP / nextLevelXP) * 100, 100)
  return { progress, nextLevelXP }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return "Just now"
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }
  
  return date.toLocaleDateString()
}

export function calculateStreakDays(lastActiveDate: Date): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActive = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate())
  
  const diffInDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
  
  // If last active was today or yesterday, maintain streak
  if (diffInDays <= 1) {
    return Math.max(1, diffInDays)
  }
  
  // Otherwise, streak is broken
  return 0
}
