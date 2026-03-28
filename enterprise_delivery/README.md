# Loomin-Docs v2.0 - Enterprise Air-Gapped Package (RHEL 9)

**Author:** Anish Anto
**Target Environment:** Red Hat Enterprise Linux 9 (Air-Gapped / No Internet)

## 📌 Submission Overview
This package is a unified, single-point-of-entry deliverable containing the fully containerized, server-grade (AMD64) artifacts for Loomin-Docs v2.0. It has been strictly engineered to meet offline deployment constraints and enterprise security requirements.

### 📦 Package Manifest
* `setup.sh`: Automated bash script for root-level deployment.
* `offline_images/loomin-backend.tar`: Compiled AMD64 Python FastAPI image.
* `offline_images/loomin-frontend.tar`: Compiled AMD64 Node React/Vite image.
* `README.md`: System architecture and deployment guide.

---

## 🏗️ System Architecture (Air-Gapped)
```mermaid
graph TD
    Client[Browser UI] -->|HTTP:80| Frontend(React/Vite Frontend)
    Frontend -->|API POST /chat| Backend(FastAPI Backend)
    
    subgraph Air-Gapped Server
        Backend --> PII[PII Sanitization Middleware]
        PII --> DB[(SQLite: loomin.db)]
        PII --> FAISS[FAISS Vector Index]
        PII --> LLM[Ollama Llama3/Mistral]
    end
    
    style Client fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style Frontend fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style Backend fill:#1e293b,stroke:#22c55e,stroke-width:2px,color:#fff
    style PII fill:#ef4444,stroke:#fff,stroke-width:2px,color:#fff