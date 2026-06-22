from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


def create_evidence_pdf(evidence):

    filename = (
        f"evidence_case_{evidence['case_id']}.pdf"
    )

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "SAHAYAK Intelligence Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Case ID: {evidence['case_id']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"DNA ID: {evidence['dna_id']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Cluster: {evidence['cluster']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Risk Level: {evidence['risk']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Fraud Type: {evidence['fraud_type']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Phone: {evidence['phone']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"UPI: {evidence['upi']}",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Investigator Notes",
            styles["Heading2"]
        )
    )

    for note in evidence["investigator_notes"]:

        content.append(
            Paragraph(
                f"• {note}",
                styles["Normal"]
            )
        )

    content.append(Spacer(1, 10))

    content.append(
        Paragraph(
            "Recommended Actions",
            styles["Heading2"]
        )
    )

    for action in evidence["recommended_actions"]:

        content.append(
            Paragraph(
                f"• {action}",
                styles["Normal"]
            )
        )

    doc.build(content)

    return filename