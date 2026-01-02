package com.pokework.ui;

/**
 * Helper class for Console colors and formatting.
 */
public class ConsoleHelper {
    public static final String RESET = "\033[0m";

    // Regular Colors
    public static final String RED = "\033[0;31m";
    public static final String GREEN = "\033[0;32m";
    public static final String YELLOW = "\033[0;33m";
    public static final String BLUE = "\033[0;34m";
    public static final String PURPLE = "\033[0;35m";
    public static final String CYAN = "\033[0;36m";
    public static final String WHITE = "\033[0;37m";

    // Bold
    public static final String RED_BOLD = "\033[1;31m";
    public static final String GREEN_BOLD = "\033[1;32m";
    public static final String YELLOW_BOLD = "\033[1;33m";
    public static final String CYAN_BOLD = "\033[1;36m";

    public static void printHeader(String title) {
        System.out.println(CYAN_BOLD + "==========================================" + RESET);
        System.out.println(YELLOW_BOLD + "       " + title.toUpperCase() + RESET);
        System.out.println(CYAN_BOLD + "==========================================" + RESET);
    }

    public static void printTitle() {
        System.out.println(
                RED_BOLD + "\nPOKE" + RESET + "-" + WHITE + "WORK" + RESET + "-" + YELLOW_BOLD + "EVOLUTION" + RESET);
    }
}
