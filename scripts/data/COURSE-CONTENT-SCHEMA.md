# Course Content JSON Schema Documentation

This document explains the structure of the `{courseId}-content.json` files used to store weekly course content.

## File Naming Convention

Files follow the pattern: `{courseId}-content.json`

Examples:
- `special-topics-content.json`
- `thesis-2-content.json`
- `behaviours-content.json`

The `courseId` must match the `id` field in `courses.json`.

## Schema Structure

### Root Level

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courseId` | string | **Yes** | Must match the course ID in `courses.json` |
| `weeks` | array | **Yes** | Weekly course content |

**Note:** Project briefs links are now stored in `courses.json` under the `projectBriefsUrl` field and displayed in the course header.

### Week Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `weekNumber` | number | **Yes** | Sequential week number (1, 2, 3, etc.) |
| `date` | string | **Yes** | Short date format (e.g., "Jan 15") |
| `overview` | string | **Yes** | Brief description of what happens this week |
| `figmaEmbed` | string | No | Full Figma embed URL for lecture slides |
| `links` | array | No | Additional relevant links for this week |

### Link Object (within weeks)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **Yes** | Display text for the link |
| `url` | string | **Yes** | Full URL (can be internal or external) |

## Field Formats

### Dates
- Format: Short month name + day (e.g., "Jan 15", "Feb 3")
- No year needed (assumed to be current academic year)

### URLs
- Must be complete URLs including protocol (`https://`)
- Figma embeds should use the embed URL format: `https://embed.figma.com/slides/...`
- Internal links can point to other pages or external resources

### Text Fields
- `overview`: 1-3 sentences describing the week's content
- `title`: Keep concise but descriptive

## Example Usage

```json
{
  "courseId": "specialTopics",
  "weeks": [
    {
      "weekNumber": 2,
      "date": "Jan 15",
      "overview": "We'll learn about the 'Monitor', discuss decision making strategies...",
      "figmaEmbed": "https://embed.figma.com/slides/...",
      "links": [
        {
          "title": "Reading Material",
          "url": "https://example.com/reading"
        }
      ]
    }
  ]
}
```

## Optional Fields

- `projectBriefs`: Can be omitted if course has no formal projects
- `figmaEmbed`: Can be omitted if no slides for that week
- `links`: Can be empty array or omitted if no additional links

## Validation Rules

1. `courseId` must exist in `courses.json`
2. Week numbers should be sequential (no gaps)
3. All URLs must be valid and include protocol
4. Dates should be chronologically ordered by week number

## Future Considerations

- May add support for multiple media embeds per week
- Consider adding `dueDate` field for assignments
- Potential for tags/categories on weeks
