const SHEET_API = "https://script.google.com/macros/s/AKfycbyl7CUNp-EXPvDqpfbO3oBPHhd7SWsGaXUf-OFG6zqDDMMYaPGElW81VPt59HttLyhxfQ/exec";

export async function getExpenses() {
  try {
    const response = await fetch(SHEET_API + "?type=get"); ;

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const rows = await response.json();

    // Convert to object list (skip header row)
    const expenses = rows.slice(1).map(row => ({
      date: row[0],
      remark: row[1],
      cashOut: Number(row[2]),
      category: row[3],
    }));

    return expenses;
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);
    return [];
  }
}

export async function addExpense({ date, remark, cashOut, category }) {
  try {
    const response = await fetch(SHEET_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        remark,
        cashOut,
        category,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    return { success: false, error };
  }
}
