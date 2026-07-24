import io
import logging

import azure.functions as func
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from shared.mock_data import get_records


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("export/pdf called")

    records = get_records()

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    y = height - 72
    c.setFont("Helvetica-Bold", 14)
    c.drawString(72, y, "R1 Solution — Records Export")
    y -= 28

    c.setFont("Helvetica-Bold", 10)
    c.drawString(72, y, "Name")
    c.drawString(250, y, "Amount")
    c.drawString(350, y, "Created")
    y -= 16

    c.setFont("Helvetica", 10)
    for r in records:
        c.drawString(72, y, str(r["name"]))
        c.drawString(250, y, str(r["amount"]))
        c.drawString(350, y, str(r["createdAt"]))
        y -= 16

    c.showPage()
    c.save()
    buffer.seek(0)

    return func.HttpResponse(
        body=buffer.read(),
        status_code=200,
        headers={
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=export.pdf",
            "Access-Control-Allow-Origin": "*",
        },
    )
