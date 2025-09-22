import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib
from pathlib import Path

# -------------------------------------------------------------------
# 1️⃣ Load the dataset
# -------------------------------------------------------------------
BASE_DIR = Path(__file__).parent.resolve()
DATA_DIR = BASE_DIR.parent / "data"
MODELS_DIR = BASE_DIR.parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

csv_files = list(DATA_DIR.glob("*.csv"))
if not csv_files:
    raise FileNotFoundError(f"No CSV file found in {DATA_DIR}")
data = pd.read_csv(csv_files[0])

print("Dataset shape:", data.shape)
print("Columns:", list(data.columns))

# -------------------------------------------------------------------
# 2️⃣ Choose target column
# -------------------------------------------------------------------
target = "threat level"
if target not in data.columns:
    raise ValueError(f"Target column '{target}' not found!")

data = data.dropna(subset=[target])

# -------------------------------------------------------------------
# 3️⃣ Filter out classes with <2 samples
# -------------------------------------------------------------------
counts = data[target].value_counts()
valid_classes = counts[counts >= 2].index
data = data[data[target].isin(valid_classes)]

# -------------------------------------------------------------------
# 4️⃣ Separate features and target
# -------------------------------------------------------------------
X = data.drop(columns=[target])
y = data[target]

categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numeric_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

print("Categorical columns:", categorical_cols)
print("Numeric columns:", numeric_cols)

# -------------------------------------------------------------------
# 5️⃣ Preprocessing pipelines
# -------------------------------------------------------------------
categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=True))
])

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", categorical_transformer, categorical_cols),
        ("num", numeric_transformer, numeric_cols)
    ]
)

# -------------------------------------------------------------------
# 6️⃣ Train/Test split
# -------------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -------------------------------------------------------------------
# 7️⃣ Build pipeline
# -------------------------------------------------------------------
clf = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=1000, solver="saga"))
])

# -------------------------------------------------------------------
# 8️⃣ Train the model
# -------------------------------------------------------------------
print("\n--- Training Model ---")
clf.fit(X_train, y_train)

# -------------------------------------------------------------------
# 9️⃣ Evaluate the model
# -------------------------------------------------------------------
y_pred = clf.predict(X_test)
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# -------------------------------------------------------------------
# 10) Save the model
# -------------------------------------------------------------------
model_path = MODELS_DIR / "zero_day_model.pkl"
joblib.dump(clf, model_path)
print(f"\n✅ Model saved to: {model_path}")

# -------------------------------------------------------------------
# 🔟 Automatic Prediction (all columns included)
# -------------------------------------------------------------------
print("\n--- Example Prediction ---")

# Prepare a default automatic input with all columns
auto_input = {}
for col in X.columns:
    if col in numeric_cols:
        auto_input[col] = 0  # or np.nan
    else:
        auto_input[col] = "unknown"  # placeholder for categorical

# You can overwrite specific columns if needed
auto_input.update({
    "protocol": "TCP",
    "flag": "SYN",
    "family": "MalwareA",
    "seddaddress": "192.168.1.1",
    "expaddress": "10.0.0.2",
    "ip address": "192.168.1.1",
    "user-agent": "Mozilla/5.0",
    "geolocation": "US",
    "event description": "Test Event"
})

# Convert to DataFrame and predict
auto_df = pd.DataFrame([auto_input])
auto_prediction = clf.predict(auto_df)[0]
print("\n🚨 Predicted Threat Label:", auto_prediction)
