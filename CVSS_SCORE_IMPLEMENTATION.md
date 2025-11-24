# CVSS Score Implementation

## Overview
Added Common Vulnerability Scoring System (CVSS) v3.1 scores to the vulnerability analysis platform.

## Backend Changes

### 1. Model Updates ✅
- Added `cvss_score` field to `Vulnerability` model
- Optional float field for individual vulnerability CVSS scores

### 2. CVSS Calculation ✅
- Created `calculate_cvss_score()` function in `analyzer.py`
- Calculates scores based on:
  - Severity level (Critical: 9.0-10.0, High: 7.0-8.9, Medium: 4.0-6.9, Low: 0.1-3.9)
  - Vulnerability type adjustments
  - STRIDE category considerations

### 3. Overall CVSS Score ✅
- Added `calculate_overall_cvss()` function in `threat_model.py`
- Calculates weighted average CVSS score for the entire file
- Weights: Critical (3.0x), High (2.0x), Medium (1.5x), Low (1.0x)
- Added `overall_cvss_score` to report summary

## Frontend Changes

### 1. Dashboard ✅
- Added "Average CVSS Score" card with prominent display
- Shows average CVSS across all scanned files
- Updates automatically when new scans are completed

### 2. Scanner Results ✅
- Displays CVSS score in analysis results
- Shows alongside Risk Score and Total Findings
- Prominently displayed in Netflix red color

### 3. Vulnerabilities Page ✅
- Added CVSS score to summary stats
- Shows overall CVSS score for the current report
- Individual vulnerabilities show their CVSS scores
- CVSS displayed next to each finding

### 4. Data Persistence ✅
- CVSS scores saved to localStorage
- Average CVSS calculated and stored in stats
- Scores persist across sessions

## CVSS Score Ranges

- **Critical**: 9.0 - 10.0 (Critical vulnerabilities)
- **High**: 7.0 - 8.9 (High severity issues)
- **Medium**: 4.0 - 6.9 (Medium severity issues)
- **Low**: 0.1 - 3.9 (Low severity issues)

## Files Modified

### Backend
- `backend/models.py` - Added cvss_score field
- `backend/analyzer.py` - Added CVSS calculation function
- `backend/threat_model.py` - Added overall CVSS calculation

### Frontend
- `src/views/Dashboard.jsx` - Added CVSS display card
- `src/views/Scanner.jsx` - Added CVSS to results
- `src/views/Vulnerabilities.jsx` - Added CVSS to summary and findings

## Usage

1. **Scan a file** - CVSS scores are automatically calculated
2. **View Dashboard** - See average CVSS across all scans
3. **View Results** - See CVSS score for each scan
4. **View Vulnerabilities** - See CVSS for each individual finding

## Benefits

- ✅ Industry-standard vulnerability scoring
- ✅ Better risk assessment and prioritization
- ✅ Comparable metrics across different scans
- ✅ Professional security reporting
- ✅ Clear visual indicators of severity

CVSS scores provide a standardized way to assess and communicate the severity of security vulnerabilities!

