import io
import logging

import azure.functions as func
import openpyxl

from shared.mock_data import get_records


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("export/excel called")

    records = get_records()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Records"
    ws.append(["Name", "Amount", "Created"])
    for r in records:
        ws.append([r["name"], r["amount"], r["createdAt"]])

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    return func.HttpResponse(
        body=buffer.read(),
        status_code=200,
        headers={
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=export.xlsx",
            "Access-Control-Allow-Origin": "*",
        },
    )
