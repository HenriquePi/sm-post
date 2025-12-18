---
trigger: model_decision
description: When building or refactoring the backend, refer to this doc. especially when handling structure
---

Backend is to be build in a modular way.
Functionalities should essentially be as self contained as possible and be plug and play.

e.g

/drawings
contains all logic for processing drawings

/llm
contains boilerplate for llm calls

/communications
contains boilerplate for email and eventually other com connectoins

/quote
contains all logic for quotations

/quote/extractor
contains all logic for extracting data from quotations

/quote/create
contains all logic for creating quotations

/price-sheet
contains all services related to price sheets

etc.
