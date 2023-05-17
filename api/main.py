from fastapi import FastAPI
from pulp import LpProblem, LpMinimize, LpVariable, lpSum
from itertools import product
from typing import List
from pydantic import BaseModel
import json
from github import Github


app = FastAPI()


class Item(BaseModel):
    clave: int
    longitud: int


token = "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"


@app.get("/read-info/")
def read_info():
    g = Github(token)
    user = g.get_user("eduardovaldesga")
    repo = user.get_repo("eduardovaldesga.github.io")
    file_encoded = repo.get_contents("assets/data.json")
    content = file_encoded.decoded_content.decode("utf-8")
    return json.loads(content)


# @app.put("/update-info/")
# def update_info(content=str):
#     g = Github(token)
#     user = g.get_user("eduardovaldesga")
#     repo = user.get_repo("eduardovaldesga.github.io")
#     file_encoded = repo.get_contents("assets/data.json")
#     sha = file_encoded.sha
#     repo.update_file("assets/data.json", "update", content, sha)


@app.get("/optimal-partition/")
def optimal_partition(size: int, **pieces):
    """Return the optimal partition of a list of pieces into a list of bins of
    a given `size`.

    Args:
        pieces (List[int]): List of longitudes of the pieces to be partitioned.
        large (int): Size of the bins.

    Returns:
        list: list of bins, each bin is a list of pieces.
    """
    print(list(pieces.values())[0])
    pieces = [int(x) for x in list(pieces.values())[0].strip().split(",")]
    problem = LpProblem("BinPacking1D", LpMinimize)
    I = J = range(len(pieces))
    # Variables
    bins = LpVariable.dicts("bin", I, cat="Binary")
    item = LpVariable.dicts("item", product(I, J), cat="Binary")
    bin_use = LpVariable.dicts("bin_use", I, cat="Continuous", lowBound=0)
    max_use = LpVariable("max_use", cat="Continuous", lowBound=0)
    aux = LpVariable.dicts("aux", I, cat="Binary")
    # Aux  variables
    for i in I:
        bin_use[i] = lpSum(long*item[i,j] for j, long in enumerate(pieces))
    # Objective
    problem += lpSum(bins) + 0.001 * (size - max_use)
    # Constraints
    for i in I:
        problem += (max_use >= bin_use[i])
        problem += (max_use <= bin_use[i] + size*(1-aux[i]))
        problem += (bin_use[i] <= size*bins[i])
    for j in J:
        problem += (lpSum(item[i, j] for i in I) == 1)
    problem += lpSum(aux[i] for i in I) == 1
    # Solve
    problem.solve()
    sol_dict = {}
    for i, j in product(I, J):
        if item[i, j].varValue:
            sol_dict.setdefault(i, []).append((j, pieces[j]))
    # Format output
    despiece = [{
        "perfil": i+1,
        "piezas": [
            {
                "clave": clave + 1,
                "longitud": long
            }
            for clave, long in piezas
            ],
    }
            for i, piezas in enumerate(sol_dict.values())]

    for pieza in despiece:
        pieza["sobrante"] = size - sum(p["longitud"] for p in pieza["piezas"])
        pieza["totalPiezas"] = len(pieza["piezas"])
        pieza["totalLongitud"] = sum(p["longitud"] for p in pieza["piezas"])

    return despiece
