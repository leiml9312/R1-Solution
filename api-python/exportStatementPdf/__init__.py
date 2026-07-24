import logging

import azure.functions as func

from shared.documents import safe_filename, build_statement_pdf


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("documents/statement/pdf called")
    try:
        data = req.get_json()
    except ValueError:
        return func.HttpResponse(
            body='{"error": "Request body must be JSON"}',
            status_code=400,
            headers={"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        )

    buffer = build_statement_pdf(data or {})
    filename = safe_filename((data or {}).get("date"), "statement") + ".pdf"

    return func.HttpResponse(
        body=buffer.read(),
        status_code=200,
        headers={
            "Content-Type": "application/pdf",
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Allow-Origin": "*",
        },
    )
