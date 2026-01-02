# Poke-Work

Welcome to your gamified productivity tracker! This project is designed to help you learn Java, JDBC, and architecture fundamentals.

## 📂 Project Structure
Values strict separation of concerns:
- **`src/main/java/com/pokework/`**: Source code
  - **`ui/`**: User Interface (Console menus)
  - **`service/`**: Business logic (XP calculation, rules)
  - **`dao/`**: Database interactions (SQL)
  - **`model/`**: Simple data classes
  - **`util/`**: Helpers (Database connection)

## 🗄️ Database Setup
1. Uses **SQLite**.
2. A `schema.sql` file is included in this folder.
3. You can initialize your database by reading this file or running the SQL commands inside it.

## 📘 How to Start
1.  **Read the Architecture Blueprint**: Check `architecture_blueprint.md` in the artifacts folder (or ask me to show it to you) to understand the plan.
2.  **Start Coding**:
    *   Begin with **Model** classes (`WorkSession.java`, `Pokemon.java`).
    *   Then build the **Database** connection (`Database.java`).
    *   Then implement **DAOs** to save data.
    *   Then add **Services** to process logic.
    *   Finally, build the **Console Menu** to tie it all together.

## 📝 Usage
This is currently a skeleton project. You will be writing the implementation code!
