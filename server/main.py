from flask import Flask, request
from flask_cors import CORS
import mysql.connector

dbconfig = {
  "database": "valde",
  "user":     "root",
  "host":     "localhost"
}

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "mypool",
    pool_size = 13,
    **dbconfig
)

app = Flask(__name__)
CORS(app)

@app.route("/members")
def members():
    connection = pool.get_connection()
    try:
        selectcursor = connection.cursor()
        selectcursor.execute("SELECT `month`, `area`, `skill` FROM `stuff`")

        result = selectcursor.fetchall()
        area = sorted({i[1] for i in result},reverse = True)
        data = {row[0]:{i[1]:i[2] for i in result if i[0] == row[0]} for row in result}

        return {'area':area,"rows": data}
    except:
        return 'Internal Server Error!', 500
    finally:
        connection.close()

    
def query(connection,query, skill, month, area):
    cursor = connection.cursor()
    val = (skill,month,area)

    cursor.execute(query,val)
    connection.commit()

@app.route('/savedata', methods=['POST'])
def savedata():
    connection = pool.get_connection()
    try:
        clientRequest = request.get_json()
        if clientRequest["value"]:
            if clientRequest["data"]["rows"][clientRequest["row"]][clientRequest["area"]]:
                query(connection,"UPDATE `stuff` SET `skill`=%s WHERE `month`=%s AND `area`=%s",int(clientRequest["value"]),int(clientRequest["row"]),clientRequest["area"])
            else:
                query(connection,"INSERT INTO `stuff`(`month`, `area`, `skill`) VALUES (%s,%s,%s)",int(clientRequest["row"]),clientRequest["area"],int(clientRequest["value"]))
        return [clientRequest]
    except:
        return 'Internal Server Error!', 500
    finally:
        connection.close()

if __name__ == "__main__":
    app.run(debug=True)
