import folium

from sqlalchemy import text

from database.session import SessionLocal


def generate_crime_map():

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                SELECT
                    city,
                    state,
                    latitude,
                    longitude,

                    COUNT(*) as total_cases,

                    MAX(network_risk) as risk_level,

                    MAX(cluster_id) as top_cluster

                FROM fraud_cases

                WHERE latitude IS NOT NULL
                AND longitude IS NOT NULL

                GROUP BY
                    city,
                    state,
                    latitude,
                    longitude
            """)
        )

        rows = result.fetchall()

        india_map = folium.Map(
            location=[22.5937, 78.9629],
            zoom_start=5
        )

        for row in rows:

            risk = row.risk_level

            if risk == "HIGH":

                color = "red"

            elif risk == "MEDIUM":

                color = "orange"

            else:

                color = "green"

            popup_text = f"""
            <b>City:</b> {row.city}<br>

            <b>State:</b> {row.state}<br>

            <b>Total Cases:</b> {row.total_cases}<br>

            <b>Risk Level:</b> {risk}<br>

            <b>Top Cluster:</b> {row.top_cluster}
            """

            folium.CircleMarker(

                location=[
                    row.latitude,
                    row.longitude
                ],

                radius=12,

                popup=popup_text,

                tooltip=f"{row.city}",

                color=color,

                fill=True,

                fill_color=color,

                fill_opacity=0.7

            ).add_to(
                india_map
            )

        filename = "crime_hotspots.html"

        india_map.save(
            filename
        )

        return {

            "status": "success",

            "map_file": filename,

            "locations": len(rows),

            "legend": {

                "HIGH": "RED",

                "MEDIUM": "ORANGE",

                "LOW": "GREEN"
            }
        }

    finally:

        db.close()