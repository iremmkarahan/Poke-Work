package com.pokework.dto;

import java.util.List;

public class AchievementResponse {
    private List<Badge> badges;
    private int unlockedCount;

    public AchievementResponse(List<Badge> badges, int unlockedCount) {
        this.badges = badges;
        this.unlockedCount = unlockedCount;
    }

    public List<Badge> getBadges() {
        return badges;
    }

    public int getUnlockedCount() {
        return unlockedCount;
    }

    public static class Badge {
        private int id;
        private String name;
        private String desc;
        private String icon;
        private boolean unlocked;
        private double currentProgress;
        private double targetProgress;

        public Badge(int id, String name, String desc, String icon, boolean unlocked, double currentProgress,
                double targetProgress) {
            this.id = id;
            this.name = name;
            this.desc = desc;
            this.icon = icon;
            this.unlocked = unlocked;
            this.currentProgress = currentProgress;
            this.targetProgress = targetProgress;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getDesc() {
            return desc;
        }

        public String getIcon() {
            return icon;
        }

        public boolean isUnlocked() {
            return unlocked;
        }

        public double getCurrentProgress() {
            return currentProgress;
        }

        public double getTargetProgress() {
            return targetProgress;
        }
    }
}
