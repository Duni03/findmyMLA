from bs4 import BeautifulSoup
import requests
import pandas as pd
import json

response = requests.get(
    'https://www.myneta.info/telangana2018/index.php?action=show_winners&sort=default')

soup = BeautifulSoup(response.content, 'html.parser')
csv_id = []
csv_name = []
csv_Assembly = []
csv_link = []
csv_Party = []
csv_case = []
csv_quali = []
csv_assest = []

mydivs = soup.find("table", {"class": "w3-table w3-bordered"})

raw_data = mydivs.find_all("tr")

for i in range(1, len(raw_data)):
    # print(i)
    csv_id.append(i)
    each_raw_data = raw_data[i].find_all("td")
    # print("Name : "+each_raw_data[1].find("a").text.strip())
    csv_name.append(str(each_raw_data[1].find("a").text.strip()))
    # print("Locality : "+each_raw_data[2].text.strip())
    csv_Assembly.append(str(each_raw_data[2].text.strip()))
    # print("Link : "+each_raw_data[1].find_all('a', href=True)[1]["href"])
    csv_link.append("https://www.myneta.info"+str(each_raw_data[1].find_all('a', href=True)[1]["href"]))
    # print("Party Name : "+each_raw_data[3].text.strip())
    csv_Party.append(str(each_raw_data[3].text.strip()))
    # print("Case : "+each_raw_data[4].text.strip())
    csv_case.append(str(each_raw_data[4].text.strip()))
    # print("Qualification : "+each_raw_data[5].text.strip())
    csv_quali.append(str(each_raw_data[5].text.strip()))
    assests = str(each_raw_data[6].text.strip()).replace(",", "")
    _assests = assests[3:assests.find("~")-1]
    # print("Assets : "+_assests)
    csv_assest.append(str(_assests))
    print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

# Creating CSV

d = {"id" :csv_id,"Name":csv_name,"Assembly":csv_Assembly,"link":csv_link,"party":csv_Party,"case":csv_case,"Qualification":csv_quali,"Assets":csv_assest}

df = pd.DataFrame(d)
 
print(df)

df.to_csv('TG_2018_Winners_DATA.csv')

# Creating JSON