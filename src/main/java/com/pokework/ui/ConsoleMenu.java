package com.pokework.ui;

import java.util.Scanner;

/**
 * Handles all user interaction (System.in / System.out).
 */
public class ConsoleMenu {

    private Scanner scanner = new Scanner(System.in);
    // private WorkService workService = new WorkService();

    public void start() {
        System.out.print("\033[H\033[2J"); // Clear screen (ANSI)
        System.out.flush();

        ConsoleHelper.printHeader("Welcome Back, Trainer!");

        boolean running = true;
        while (running) {
            printMenu();
            String input = scanner.nextLine();

            switch (input) {
                case "1":
                    System.out.println(ConsoleHelper.YELLOW + ">> Feature not implemented yet." + ConsoleHelper.RESET);
                    break;
                case "2":
                    System.out.println(ConsoleHelper.YELLOW + ">> Feature not implemented yet." + ConsoleHelper.RESET);
                    break;
                case "3":
                    System.out.println(ConsoleHelper.YELLOW + ">> Feature not implemented yet." + ConsoleHelper.RESET);
                    break;
                case "4":
                    System.out.println(ConsoleHelper.RED + "Exiting..." + ConsoleHelper.RESET);
                    running = false;
                    break;
                default:
                    System.out.println(
                            ConsoleHelper.RED_BOLD + "Invalid option, please try again." + ConsoleHelper.RESET);
            }
        }
    }

    private void printMenu() {
        ConsoleHelper.printTitle();
        System.out.println(ConsoleHelper.CYAN + "1." + ConsoleHelper.RESET + " Log Work Hours");
        System.out.println(ConsoleHelper.CYAN + "2." + ConsoleHelper.RESET + " Check Statistics");
        System.out.println(ConsoleHelper.CYAN + "3." + ConsoleHelper.RESET + " View Pokemon Status");
        System.out.println(ConsoleHelper.CYAN + "4." + ConsoleHelper.RESET + " Exit");
        System.out.print(ConsoleHelper.GREEN_BOLD + "Choose an option > " + ConsoleHelper.RESET);
    }
}
