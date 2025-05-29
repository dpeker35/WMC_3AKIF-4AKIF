// js/matrix.js

document.addEventListener("DOMContentLoaded", () => {
  const matrixOperationSelect = document.getElementById("matrix-operation");
  const matrixInputsDiv = document.getElementById("matrix-inputs");
  const calculateMatrixBtn = document.getElementById("calculate-matrix");
  const matrixResultDiv = document.getElementById("matrix-result");

  matrixOperationSelect.addEventListener("change", updateMatrixInputs);
  calculateMatrixBtn.addEventListener("click", calculateMatrixOperation);
  updateMatrixInputs();

  function updateMatrixInputs() {
    const operation = matrixOperationSelect.value;
    matrixInputsDiv.innerHTML = "";
    matrixResultDiv.innerHTML = "";

    if (operation === "multiplication") {
      const labelA = document.createElement("label");
      labelA.textContent = "Matrix A (each row consists of comma-separated numbers; on a new line):";
      labelA.className = "form-label";
      const textareaA = document.createElement("textarea");
      textareaA.id = "matrixA";
      textareaA.className = "form-control mb-3";
      textareaA.rows = 4;
      textareaA.placeholder = "Example:\n1,2,3\n4,5,6";

      const labelB = document.createElement("label");
      labelB.textContent = "Matrix B (each row contains comma-separated numbers; each on a new line):";
      labelB.className = "form-label";
      const textareaB = document.createElement("textarea");
      textareaB.id = "matrixB";
      textareaB.className = "form-control mb-3";
      textareaB.rows = 4;
      textareaB.placeholder = "Example:\n7,8\n9,10\n11,12";

      matrixInputsDiv.appendChild(labelA);
      matrixInputsDiv.appendChild(textareaA);
      matrixInputsDiv.appendChild(labelB);
      matrixInputsDiv.appendChild(textareaB);
    } else {
      const label = document.createElement("label");
      if (operation === "adjacency") {
        label.textContent = "Enter Graph Edges (one edge per line, e.g.: 1-2):";
      } else if (operation === "path") {
        label.textContent = "Adjacency Matrix for Path Matrix (square, with 0 and 1 values):";
      } else if (operation === "distance") {
        label.textContent = "For Distance Matrix (enter 1 if there is an edge, 0 if there isn't):";
      } else if (operation === "eccentricity") {
        label.textContent = "Distance Matrix for Radius/Diameter Calculation (1 if there is an edge, 0 if not):";
      } else if (operation === "components") {
        label.textContent = "Adjacency Matrix for Connected Components (square matrix with 0 and 1 values):";
      }
      label.className = "form-label";
      const textarea = document.createElement("textarea");
      textarea.id = "matrixInput";
      textarea.className = "form-control mb-3";
      textarea.rows = 4;
      textarea.placeholder = (operation === "adjacency")
        ? "Example:\n1-2\n2-5\n3-4"
        : "Example:\n0,1,0\n1,0,1\n0,1,0";
      matrixInputsDiv.appendChild(label);
      matrixInputsDiv.appendChild(textarea);
    }
  }

  function calculateMatrixOperation() {
    const operation = matrixOperationSelect.value;
    matrixResultDiv.innerHTML = "";

    if (operation === "multiplication") {
      const matrixAText = document.getElementById("matrixA").value.trim();
      const matrixBText = document.getElementById("matrixB").value.trim();
      try {
        const matrixA = parseMatrix(matrixAText);
        const matrixB = parseMatrix(matrixBText);
        if (matrixA[0].length !== matrixB.length) {
          throw new Error("For matrix multiplication, the number of columns in Matrix A must be equal to the number of rows in Matrix B.");
        }
        const product = multiplyMatrices(matrixA, matrixB);
        matrixResultDiv.innerHTML = `<strong>Multiplication Result:</strong><br>${formatMatrix(product)}`;
      } catch (error) {
        matrixResultDiv.innerHTML = `<span class="text-danger">${error.message}</span>`;
      }
    } else if (operation === "adjacency") {
      const edgeText = document.getElementById("matrixInput").value.trim();
      try {
        const edges = edgeText.split("\n").map(line => line.trim()).filter(line => line !== "");
        const nodeSet = new Set();

        const edgePairs = edges.map(line => {
          const [a, b] = line.split("-").map(n => n.trim());
          nodeSet.add(a);
          nodeSet.add(b);
          return [a, b];
        });

        const nodes = Array.from(nodeSet).sort((a, b) => a - b);
        const indexMap = {};
        nodes.forEach((node, i) => indexMap[node] = i);

        const n = nodes.length;
        const matrix = Array.from({ length: n }, () => Array(n).fill(0));

        edgePairs.forEach(([a, b]) => {
          const i = indexMap[a];
          const j = indexMap[b];
          matrix[i][j] = 1;
          matrix[j][i] = 1;
        });

        matrixResultDiv.innerHTML = `<strong>Nodes:</strong> [${nodes.join(", ")}]
<strong>Adjacency Matrix:</strong><br>${formatMatrix(matrix)}`;
      } catch (error) {
        matrixResultDiv.innerHTML = `<span class="text-danger">${error.message}</span>`;
      }
    } else {
      const matrixText = document.getElementById("matrixInput").value.trim();
      try {
        const matrix = parseMatrix(matrixText);
        if (operation === "path") {
          const pathMatrix = computePathMatrix(matrix);
          matrixResultDiv.innerHTML = `<strong>Path Matrix (Transitive Closure):</strong><br>${formatMatrix(pathMatrix)}`;
        } else if (operation === "distance") {
          const distMatrix = computeDistanceMatrix(matrix);
          matrixResultDiv.innerHTML = `<strong>Distance Matrix:</strong><br>${formatMatrixWithInfinity(distMatrix)}`;
        } else if (operation === "eccentricity") {
          const distMatrix = computeDistanceMatrix(matrix);
          const ecc = computeEccentricities(distMatrix);
          const radius = Math.min(...ecc.filter(val => val < Infinity));
          const diameter = Math.max(...ecc.filter(val => val < Infinity));
          matrixResultDiv.innerHTML = `<strong>Eccentricities:</strong><br>${ecc.join(", ")}<br><strong>(Radius):</strong> ${radius}<br><strong>Diameter:</strong> ${diameter}`;
        } else if (operation === "components") {
          const pathMatrix = computePathMatrix(matrix);
          const components = computeComponents(pathMatrix);
          matrixResultDiv.innerHTML = `<strong>Connected Components:</strong><br>${components.map((comp, idx) => `Component ${idx + 1}: [${comp.join(", ")}]`).join("<br>")}`;
        }
      } catch (error) {
        matrixResultDiv.innerHTML = `<span class="text-danger">${error.message}</span>`;
      }
    }
  }

  function parseMatrix(text) {
    const rows = text.split("\n").filter(row => row.trim() !== "");
    return rows.map(row => row.split(",").map(val => {
      const num = parseFloat(val.trim());
      if (isNaN(num)) throw new Error("Matrix values must be valid numbers.");
      return num;
    }));
  }

  function multiplyMatrices(A, B) {
    const aRows = A.length, aCols = A[0].length, bCols = B[0].length;
    const product = Array.from({ length: aRows }, () => Array(bCols).fill(0));
    for (let i = 0; i < aRows; i++) {
      for (let j = 0; j < bCols; j++) {
        for (let k = 0; k < aCols; k++) {
          product[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return product;
  }

  function computePathMatrix(matrix) {
    const n = matrix.length;
    const result = matrix.map(row => row.slice());
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (result[i][j] === 0 && result[i][k] === 1 && result[k][j] === 1) {
            result[i][j] = 1;
          }
        }
      }
    }
    return result;
  }

  function computeDistanceMatrix(matrix) {
    const n = matrix.length;
    const dist = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 0 : (matrix[i][j] !== 0 ? matrix[i][j] : Infinity)))
    );
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }
    return dist;
  }

  function formatMatrixWithInfinity(matrix) {
    return matrix.map(row => row.map(val => (val === Infinity ? "∞" : val)).join(", ")).join("<br>");
  }

  function computeEccentricities(distMatrix) {
    return distMatrix.map(row => {
      const finiteValues = row.filter(val => val < Infinity);
      return finiteValues.length > 0 ? Math.max(...finiteValues) : Infinity;
    });
  }

  function computeComponents(pathMatrix) {
    const compMap = {};
    for (let i = 0; i < pathMatrix.length; i++) {
      const key = JSON.stringify(pathMatrix[i]);
      if (!compMap[key]) compMap[key] = [];
      compMap[key].push(i);
    }
    return Object.values(compMap);
  }

  function formatMatrix(matrix) {
    return matrix.map(row => row.join(", ")).join("<br>");
  }
});
