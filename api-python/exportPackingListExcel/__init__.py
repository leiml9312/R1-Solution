import logging

import azure.functions as func

from shared.documents import safe_filename, build_packing_list_xlsx


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("documents/packing-list/excel called")
    try:
        data = req.get_json()
    except ValueError:
        return func.HttpResponse(
            body='{"error": "Request body must be JSON"}',
            status_code=400,
            headers={"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        )

    buffer = build_packing_list_xlsx(data or {})
    filename = safe_filename((data or {}).get("no"), "packing-list") + ".xlsx"

    return func.HttpResponse(
        body=buffer.read(),
        status_code=200,
        headers={
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Allow-Origin": "*",
        },
    )
