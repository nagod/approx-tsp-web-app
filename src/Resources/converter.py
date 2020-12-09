import tkinter as tk
from tkinter import filedialog
import json
import os
root = tk.Tk()
root.withdraw()

file = filedialog.askopenfile(mode='r', title="Open file", filetypes=[
    ('Text Files', '*.txt')])
# Get name from opend file
file_name = os.path.split(file.name)[1].split(".")[0]

# Dict for JSon File
dict1 = []

if file:
    for line in file:
        values = line.split()
        if(values):
            dict1.append({
                "id":   values[0],
                "xPos": values[1],
                "yPos": values[2]
            })

# Generating Output file, same name as Input file
out_file = open(file_name + ".json", "w")
json.dump(dict1, out_file, indent=4)
out_file.close()
