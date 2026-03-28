# Loomin-Docs V2.0 - Enterprise AI

This repository contains the source code for the Loomin-Docs RAG platform, optimized for production-grade performance.

**Note:** The full Enterprise Delivery Package (including the 4.7GB Llama 3 weights and RHEL 9 Docker images) is provided via the shared Google Drive link for deployment due to GitHub file size constraints.

### Key Features:
* **Air-Gapped Deployment:** Engineered for RHEL 9 environments with zero internet access.
* **PII Sanitization:** Built-in interceptor to catch and mask sensitive data patterns.
* **Local Inference:** Fully integrated with Llama 3 (GGUF) via Ollama.
* **Vector Persistence:** FAISS indexing with SQLite for permanent chat history.
