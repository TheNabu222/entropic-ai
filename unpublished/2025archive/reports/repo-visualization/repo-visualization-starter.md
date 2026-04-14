# Repo Visualization Starter Pack

## Scope map (top-level areas)
- `live-coaiexist/`: published web experiences and themed sub-sites.
- `unpublished/`: experiments, drafts, and archived variants.
- `python/` + `verification/`: automation and validation scripts.
- `resonance-engine-(techater-protocol)/` + `tsx/`: typed app components/services.
- `assets/` + `_coai-sprites/` + `svgs/`: large media and design libraries.
- `.github/workflows/`: CI automation entrypoints.

## Recommended “first 12” diagrams to build now
1. System context diagram
2. Component diagram
3. Deployment diagram
4. Package diagram
5. Use case diagram
6. Sequence diagram
7. Activity diagram
8. State diagram
9. Data flow diagram
10. Entity-relationship diagram
11. Gantt chart
12. Sankey diagram

## Mermaid templates

### 1) System context diagram
```mermaid
flowchart LR
  Contributor --> Repo[entropic-ai repo]
  Repo --> Live[live-coaiexist]
  Repo --> Drafts[unpublished]
  Repo --> Tools[python + verification]
  Repo --> Engine[resonance-engine + tsx]
  Repo --> Assets[assets + svgs]
  CI[GitHub Actions] --> Repo
```

### 2) Component diagram
```mermaid
flowchart TB
  subgraph Web
    LiveSite[live-coaiexist/*.html]
    DraftSite[unpublished/*.html]
  end
  subgraph Logic
    JS[js + embedded scripts]
    Py[python scripts]
    Verify[verification/verify_game.py]
  end
  subgraph Content
    Data[data/*.json]
    Media[assets/_coai-sprites/svgs]
  end
  LiveSite --> JS
  DraftSite --> JS
  JS --> Data
  LiveSite --> Media
  DraftSite --> Media
  Py --> Data
  Verify --> LiveSite
```

### 3) Sequence diagram (content update)
```mermaid
sequenceDiagram
  participant Author
  participant Script as python/*.py
  participant Repo
  participant Verify as verification/verify_game.py
  Author->>Script: prepare/rename assets or HTML
  Script->>Repo: write updated files
  Author->>Verify: run checks
  Verify->>Repo: validate behavior
```

### 4) Data flow diagram
```mermaid
flowchart LR
  A[Raw media in assets] --> B[HTML pages in live-coaiexist/unpublished]
  C[JSON in data/] --> B
  D[Python tooling] --> B
  B --> E[User browser runtime]
  B --> F[Verification scripts]
```

### 5) ERD (lightweight)
```mermaid
erDiagram
  PAGE ||--o{ ASSET_REF : references
  PAGE ||--o{ SCRIPT : includes
  SCRIPT ||--o{ DATA_FILE : reads
  DATA_FILE {
    string path
    string format
  }
  PAGE {
    string path
    string section
  }
  ASSET_REF {
    string path
    string type
  }
```
