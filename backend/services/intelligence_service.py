def detect_fraud_patterns(text):

    text = text.lower()

    authority_keywords = [
        "cbi",
        "ed",
        "customs",
        "police",
        "crime branch"
    ]

    urgency_keywords = [
        "arrest",
        "urgent",
        "immediately",
        "jail",
        "investigation"
    ]

    payment_keywords = [
        "upi",
        "payment",
        "transfer",
        "money",
        "deposit"
    ]

    authority_score = 0
    urgency_score = 0
    payment_score = 0

    indicators = []

    for word in authority_keywords:

        if word in text:
            authority_score += 20

    for word in urgency_keywords:

        if word in text:
            urgency_score += 20

    for word in payment_keywords:

        if word in text:
            payment_score += 20

    authority_score = min(authority_score, 100)
    urgency_score = min(urgency_score, 100)
    payment_score = min(payment_score, 100)

    if authority_score > 0:
        indicators.append(
            "Government Authority Impersonation"
        )

    if urgency_score > 0:
        indicators.append(
            "Fear/Urgency Tactics"
        )

    if payment_score > 0:
        indicators.append(
            "Financial Transfer Request"
        )

    total_score = (
        authority_score +
        urgency_score +
        payment_score
    )

    confidence_score = round(
        total_score / 3,
        2
    )

    return {

        "authority_score":
        authority_score,

        "urgency_score":
        urgency_score,

        "payment_score":
        payment_score,

        "confidence_score":
        confidence_score,

        "indicators":
        indicators
    }