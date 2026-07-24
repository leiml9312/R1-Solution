import logging

import azure.functions as func

from shared.documents import safe_filename, build_invoice_pdf


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("documents/invoice/pdf called")
    try:
        data = req.get_json()
    except ValueError:
        return func.HttpResponse(
            body='{"error": "Request body must be JSON"}',
            status_code=400,
            headers={"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        )

    buffer = build_invoice_pdf(data or {})
    filename = safe_filename((data or {}).get("invoiceNo"), "invoice") + ".pdf"

    return func.HttpResponse(
        body=buffer.read(),
        status_code=200,
        headers={
            "Content-Type": "application/pdf",
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Allow-Origin": "*",
        },
    )
