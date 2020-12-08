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

# Array for Entries
array = []

# Array for Json-Format-Objs
dict1 = []

if file:
    for line in file:
        values = line.split()
        array.append(values)
# Pop First "Counter" useless Element
for arr in array:
    if(arr):
        arr.pop(0)
# Append Json-Format to dict
for arr in array:
    if(arr):
        dict1.append({
            "xPos": arr[0],
            "yPos": arr[1]
        })

# Generates outfile
out_file = open(file_name + ".json", "w")
json.dump(dict1, out_file)
out_file.close()
