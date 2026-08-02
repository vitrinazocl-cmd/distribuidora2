import pandas as pd

try:
    df = pd.read_excel('Catalogo_Detallado_Eleodoro.csv final.xlsx')
    print("Columns:")
    print(df.columns.tolist())
    print("\nFirst 3 rows:")
    print(df.head(3).to_string())
    print("\nData shape:", df.shape)
except Exception as e:
    print("Error reading Excel with pandas:", e)
