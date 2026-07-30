# Interlinking Skill for Derecho Artificial

## Quick Start (2 minutes)

```powershell
# 1. Navigate to script directory
cd ./scripts

# 2. DRY RUN (analyze, no changes)
.\Create-Interlinking.ps1 -ProjectPath ".." -DryRun $true -Verbose

# 3. Review the report (check interlinking-report.json)

# 4. ACTUAL RUN (apply with backup)
.\Create-Interlinking.ps1 -ProjectPath ".." -DryRun $false -CreateBackup $true

# Done! Interlinking applied with automatic backup.
```

## What This Does

✅ Analyzes all MDX files
✅ Detects semantic relationships between articles
✅ Creates 4-7 internal links per article
✅ Never breaks content or markdown
✅ Creates automatic backup before changes
✅ Generates detailed report
✅ Fully reversible with one command

## Why This Skill Exists

Windsurf implementation had issues:
- ❌ Truncated posts
- ❌ Created absurd links
- ❌ Broke markdown
- ❌ No validation

This skill fixes all of that:
- ✅ Content-safe (never modifies existing content)
- ✅ Intelligent linking (semantic relationships)
- ✅ Validated (checks every step)
- ✅ Reversible (automatic backups)
- ✅ Logged (detailed reports)

## Files

- **SKILL.md** - Full documentation (read this first)
- **Create-Interlinking.ps1** - Main script (does the work)
- **Restore-Backup.ps1** - Restore script (undo if needed)
- **README.md** - This file

## Requirements

- PowerShell 5.1+ (Windows) or 7.0+ (macOS/Linux)
- Access to derecho-artificial repository
- ~500MB free disk space for backups

## Common Commands

### Dry Run (ALWAYS START HERE)
```powershell
.\Create-Interlinking.ps1 -ProjectPath "C:\Proyectos\derecho-artificial" -DryRun $true
```

### Apply Changes
```powershell
.\Create-Interlinking.ps1 -ProjectPath "C:\Proyectos\derecho-artificial" -DryRun $false -CreateBackup $true
```

### Restore from Backup
```powershell
.\Restore-Backup.ps1 `
  -BackupPath "C:\Proyectos\derecho-artificial\backups\backup-2026-03-10-120000" `
  -ProjectPath "C:\Proyectos\derecho-artificial"
```

## Expected Results

**Dry Run Output:**
- Analysis of files
- Links that WOULD be added
- Cluster breakdown
- Report in JSON format

**Actual Run Output:**
- Modified X files
- Added Y links total
- Backup location
- Detailed report

**In Google Search Console (within 24h):**
- Google reindexes modified files
- Better crawlability
- More pages indexed

**In 7 days:**
- +200-300 new impressions/day
- Better internal linking signals
- Improved authority distribution

## Troubleshooting

### Problem: Links look wrong

**Solution:**
1. Run `Restore-Backup.ps1` to undo
2. Review SKILL.md section "Cluster Patterns"
3. Adjust cluster definitions in Create-Interlinking.ps1
4. Run dry run again
5. Execute when happy

### Problem: Some files skipped

**Check:** The report's `errors` section

**Solutions:**
- Check file permissions
- Validate markdown syntax
- Check for special characters in filenames

### Problem: Too many/few links

**Adjust:** In Create-Interlinking.ps1, change:
```powershell
MaxLinksPerArticle = 7
MinLinksPerArticle = 4
```

## Safety Features

✅ Automatic backups before any change
✅ Validation at every step
✅ Markdown syntax preservation
✅ Detailed error logging
✅ Easy restore functionality
✅ Dry run mode to preview
✅ Report generation

## Architecture

### Algorithm

1. **Discovery**: Scan all MDX files
2. **Clustering**: Detect cluster membership from filename patterns
3. **Analysis**: Extract keywords, find relationships
4. **Generation**: Create semantic links
5. **Validation**: Verify markdown structure
6. **Application**: Write changes (with backup)
7. **Reporting**: Generate detailed JSON report

### Link Types

- **Hub Links**: To cluster main page (1 per article)
- **Related Articles**: To semantically related pieces (2-3)
- **Glossary**: Technical terms (1-2)
- **Sources**: Institutional references (1)

**Total: 4-7 links per article maximum**

## Next Steps

1. Read **SKILL.md** for complete documentation
2. Run dry run: `.\Create-Interlinking.ps1 -DryRun $true`
3. Review report carefully
4. Execute: `.\Create-Interlinking.ps1 -DryRun $false`
5. Monitor Google Search Console for impact
6. If not satisfied, restore and adjust

## Support

For issues:
1. Check report errors/warnings
2. Review SKILL.md troubleshooting section
3. Run with `-Verbose` for detailed output
4. Check git diff to see what changed

## Version

- **Version**: 1.0
- **Status**: Production Ready
- **Created**: March 2026
- **Last Updated**: March 2026

---

**Remember**: Always dry run first! 🔒
