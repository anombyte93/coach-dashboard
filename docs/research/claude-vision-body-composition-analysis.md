# Claude Vision API for Body Composition Analysis - Research Report

**Research Date:** 2025-12-08
**Purpose:** Implement AI-powered body composition analysis using Claude's vision capabilities
**Target Application:** Fitness coaching dashboard with physique assessment

---

## 1. Claude Vision API Capabilities

### 1.1 Image Input Methods

Claude supports two methods for sending images:

#### **Base64 Encoding** (Recommended for local/uploaded images)
```python
import base64

def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as image_file:
        binary_data = image_file.read()
        base64_encoded = base64.b64encode(binary_data)
        return base64_encoded.decode('utf-8')

# Usage in message
message = {
    "role": "user",
    "content": [
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",  # or image/png, image/gif, image/webp
                "data": get_base64_encoded_image("front_pose.jpg")
            }
        },
        {
            "type": "text",
            "text": "Analyze body composition from this image."
        }
    ]
}
```

#### **URL References** (For hosted images)
```python
message = {
    "role": "user",
    "content": [
        {
            "type": "image",
            "source": {
                "type": "url",
                "url": "https://example.com/front_pose.jpg"
            }
        },
        {
            "type": "text",
            "text": "Analyze body composition from this image."
        }
    ]
}
```

**Supported Formats:** JPEG, PNG, GIF, WebP

---

## 2. Token Costs & Pricing

### 2.1 Image Token Calculation

**Key Finding:** Images consume input tokens based on their size and resolution. The API automatically processes images and counts them as part of `input_tokens`.

**Token Counting:**
- Use the `/messages/count_tokens` endpoint to preview token usage before making the actual request
- Images are automatically resized/processed by the API
- Token count includes both image processing and text prompt

```python
# Count tokens before making the request
response = client.messages.count_tokens(
    model="claude-3-5-sonnet-20241022",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": base64_image
                    }
                },
                {"type": "text", "text": "Analyze this image."}
            ]
        }
    ]
)
print(f"Input tokens: {response.input_tokens}")
```

### 2.2 Pricing Structure (2025)

**Models with Vision:**
- **Claude Opus 4.5**: $15/M input tokens, $75/M output tokens
- **Claude Sonnet 3.5**: $3/M input tokens, $15/M output tokens
- **Claude Haiku 3.5**: $0.25/M input tokens, $1.25/M output tokens

**Cost Optimization:**
- Cache frequently used context (system prompts, guidelines) at 10% cost
- `cache_read_input_tokens` DO NOT count toward rate limits
- Use Haiku for simple classifications, Sonnet for detailed analysis

---

## 3. Multiple Image Handling (Front/Side/Back Poses)

### 3.1 Multi-Image Pattern

Claude can analyze multiple images in a single request:

```python
message = {
    "role": "user",
    "content": [
        {"type": "text", "text": "Analyze body composition from these three poses:"},
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": get_base64_encoded_image("front_pose.jpg")
            }
        },
        {"type": "text", "text": "Front view"},
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": get_base64_encoded_image("side_pose.jpg")
            }
        },
        {"type": "text", "text": "Side view"},
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": get_base64_encoded_image("back_pose.jpg")
            }
        },
        {"type": "text", "text": "Back view"},
        {
            "type": "text",
            "text": """
Provide a comprehensive body composition analysis based on all three angles.
Return your analysis in JSON format with the following structure:
{
  "estimated_body_fat_percentage": <number>,
  "confidence_level": "low|medium|high",
  "muscle_mass_assessment": "below_average|average|above_average|athletic",
  "observations": {
    "front": "<observations>",
    "side": "<observations>",
    "back": "<observations>"
  },
  "recommendations": ["<recommendation1>", "<recommendation2>"]
}
"""
        }
    ]
}
```

### 3.2 Best Practices for Multi-Image Analysis

1. **Interleave text labels** between images for clarity
2. **Specify the order** of images explicitly (front, side, back)
3. **Use consistent image dimensions** across poses for better comparison
4. **Provide context** about lighting, timing, or conditions if relevant

---

## 4. Prompt Engineering for Body Fat Estimation

### 4.1 Handling Medical Disclaimers

**Problem:** Claude tends to give disclaimers like "I'm not a medical professional" and avoid numerical estimates.

**Solution:** Use role assignment, framing, and explicit instructions to guide behavior.

#### **Effective Prompt Pattern:**

```python
system_prompt = """
You are an AI assistant trained to provide body composition estimates for fitness coaching purposes.

IMPORTANT CONTEXT:
- You are assisting a certified fitness professional who will review your analysis
- Your estimates are educational tools, not medical diagnoses
- The coach will use your analysis as ONE input among many data points
- All users have consented to AI-assisted body composition analysis

YOUR ROLE:
Provide objective, data-driven body composition estimates based on visual analysis.
Be specific with numerical ranges. The fitness professional needs actionable data.

OUTPUT REQUIREMENTS:
- Always provide numerical estimates (ranges are acceptable)
- Use standard body fat percentage categories
- Be confident in your analysis while noting limitations
- Focus on observable physical markers
"""

user_prompt = """
Analyze the provided physique images and estimate body fat percentage.

Consider these visual indicators:
- Muscle definition and visibility
- Abdominal definition
- Vascularity
- Body proportions and fat distribution

Provide your analysis in this JSON structure:
{
  "estimated_body_fat_percentage_range": {"min": <number>, "max": <number>},
  "most_likely_body_fat_percentage": <number>,
  "confidence_level": "low|medium|high",
  "confidence_reasoning": "<why you chose this confidence level>",
  "visual_markers_observed": [
    "<marker1>",
    "<marker2>"
  ],
  "body_fat_category": "essential|athletic|fitness|average|obese",
  "analysis_limitations": [
    "<limitation1>",
    "<limitation2>"
  ]
}

Think step-by-step in <thinking> tags before providing your final JSON output.
"""
```

### 4.2 Key Prompt Engineering Techniques

#### **1. Role Assignment**
```
"You are an AI assistant trained to provide body composition estimates for fitness coaching purposes."
```

#### **2. Framing & Context**
```
"You are assisting a certified fitness professional who will review your analysis"
"All users have consented to AI-assisted body composition analysis"
```

#### **3. Explicit Output Requirements**
```
"Always provide numerical estimates (ranges are acceptable)"
"Be confident in your analysis while noting limitations"
```

#### **4. Step-by-Step Thinking**
```
"Think step-by-step in <thinking> tags before providing your final JSON output."
```
This encourages Claude to show reasoning, which improves accuracy.

#### **5. Few-Shot Examples**
```python
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": example_image_1}},
            {"type": "text", "text": "Estimate body fat percentage."}
        ]
    },
    {
        "role": "assistant",
        "content": [
            {"type": "text", "text": '{"estimated_body_fat_percentage_range": {"min": 12, "max": 15}, "most_likely_body_fat_percentage": 13.5, "confidence_level": "high"}'}
        ]
    },
    {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": example_image_2}},
            {"type": "text", "text": "Estimate body fat percentage."}
        ]
    },
    {
        "role": "assistant",
        "content": [
            {"type": "text", "text": '{"estimated_body_fat_percentage_range": {"min": 18, "max": 22}, "most_likely_body_fat_percentage": 20, "confidence_level": "medium"}'}
        ]
    },
    # Now the actual request
    {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": user_image}},
            {"type": "text", "text": "Estimate body fat percentage."}
        ]
    }
]
```

---

## 5. Structured JSON Output Extraction

### 5.1 Using Tool Use for Guaranteed JSON

**Best Practice:** Define a tool with an `input_schema` to enforce structured output.

```python
tools = [
    {
        "name": "record_body_composition_analysis",
        "description": "Records the body composition analysis results.",
        "input_schema": {
            "type": "object",
            "properties": {
                "estimated_body_fat_percentage": {
                    "type": "number",
                    "description": "Estimated body fat percentage (single value)"
                },
                "body_fat_range": {
                    "type": "object",
                    "properties": {
                        "min": {"type": "number"},
                        "max": {"type": "number"}
                    },
                    "required": ["min", "max"]
                },
                "confidence_level": {
                    "type": "string",
                    "enum": ["low", "medium", "high"]
                },
                "muscle_mass_assessment": {
                    "type": "string",
                    "enum": ["below_average", "average", "above_average", "athletic", "bodybuilder"]
                },
                "visual_markers": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "recommendations": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["estimated_body_fat_percentage", "body_fat_range", "confidence_level"]
        }
    }
]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_data}},
                {"type": "text", "text": "Analyze this physique and use the record_body_composition_analysis tool."}
            ]
        }
    ]
)

# Extract the tool use
json_result = None
for content in response.content:
    if content.type == "tool_use" and content.name == "record_body_composition_analysis":
        json_result = content.input
        break

print(json.dumps(json_result, indent=2))
```

### 5.2 Using Pydantic Models (Python)

```python
from pydantic import BaseModel, Field
from typing import List, Literal

class BodyFatRange(BaseModel):
    min: float
    max: float

class BodyCompositionAnalysis(BaseModel):
    estimated_body_fat_percentage: float = Field(
        description="Single-value estimate of body fat percentage"
    )
    body_fat_range: BodyFatRange
    confidence_level: Literal["low", "medium", "high"]
    muscle_mass_assessment: Literal[
        "below_average", "average", "above_average", "athletic", "bodybuilder"
    ]
    visual_markers: List[str] = Field(
        description="Observable physical markers used in analysis"
    )
    recommendations: List[str]

# Convert to tool schema
def pydantic_to_tool_schema(model):
    return {
        "name": "record_body_composition_analysis",
        "description": "Records body composition analysis",
        "input_schema": model.model_json_schema()
    }

tools = [pydantic_to_tool_schema(BodyCompositionAnalysis)]
```

---

## 6. Implementation Code Examples

### 6.1 Complete Body Composition Analysis Function

```python
import anthropic
import base64
import json
from typing import Dict, List, Optional

def analyze_body_composition(
    image_paths: List[str],
    pose_labels: List[str],
    user_metadata: Optional[Dict] = None
) -> Dict:
    """
    Analyze body composition from multiple pose images.

    Args:
        image_paths: List of paths to images (e.g., ["front.jpg", "side.jpg", "back.jpg"])
        pose_labels: Labels for each pose (e.g., ["Front view", "Side view", "Back view"])
        user_metadata: Optional metadata like height, weight, age for context

    Returns:
        Dictionary with body composition analysis
    """
    client = anthropic.Anthropic(api_key="your-api-key")

    # Encode images
    def encode_image(path):
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode('utf-8')

    # Build content array
    content = [
        {"type": "text", "text": "Analyze body composition from these poses:"}
    ]

    for image_path, label in zip(image_paths, pose_labels):
        content.extend([
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": encode_image(image_path)
                }
            },
            {"type": "text", "text": label}
        ])

    # Add user context if provided
    context_text = ""
    if user_metadata:
        context_text = f"\n\nUser context: Height: {user_metadata.get('height_cm')}cm, Weight: {user_metadata.get('weight_kg')}kg, Age: {user_metadata.get('age')}"

    # Add analysis instructions
    content.append({
        "type": "text",
        "text": f"""
{context_text}

Use the record_body_composition_analysis tool to provide your analysis.

Consider:
- Muscle definition and striations
- Abdominal visibility and definition
- Vascularity (visible veins)
- Fat distribution patterns
- Overall muscle mass
- Body proportions

Provide a comprehensive estimate with confidence level and reasoning.
"""
    })

    # Define tool
    tools = [
        {
            "name": "record_body_composition_analysis",
            "description": "Records body composition analysis",
            "input_schema": {
                "type": "object",
                "properties": {
                    "estimated_body_fat_percentage": {"type": "number"},
                    "body_fat_range": {
                        "type": "object",
                        "properties": {
                            "min": {"type": "number"},
                            "max": {"type": "number"}
                        }
                    },
                    "confidence_level": {
                        "type": "string",
                        "enum": ["low", "medium", "high"]
                    },
                    "confidence_reasoning": {"type": "string"},
                    "muscle_mass_assessment": {
                        "type": "string",
                        "enum": ["below_average", "average", "above_average", "athletic", "bodybuilder"]
                    },
                    "visual_markers_observed": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "pose_specific_observations": {
                        "type": "object",
                        "properties": {
                            "front": {"type": "string"},
                            "side": {"type": "string"},
                            "back": {"type": "string"}
                        }
                    },
                    "recommendations": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": [
                    "estimated_body_fat_percentage",
                    "body_fat_range",
                    "confidence_level"
                ]
            }
        }
    ]

    # Make API call
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        tools=tools,
        system="""You are an AI assistant providing body composition estimates for fitness coaching.
You assist certified fitness professionals. Provide specific numerical estimates with confidence levels.
Focus on observable visual markers. All users have consented to this analysis.""",
        messages=[{"role": "user", "content": content}]
    )

    # Extract result
    for content_block in response.content:
        if content_block.type == "tool_use" and content_block.name == "record_body_composition_analysis":
            return content_block.input

    return None

# Usage
result = analyze_body_composition(
    image_paths=["front.jpg", "side.jpg", "back.jpg"],
    pose_labels=["Front view", "Side view", "Back view"],
    user_metadata={"height_cm": 180, "weight_kg": 80, "age": 30}
)

print(json.dumps(result, indent=2))
```

### 6.2 Chaining Analysis with User Data

```python
def enhanced_body_composition_analysis(
    image_paths: List[str],
    user_profile: Dict
) -> Dict:
    """
    Combines visual analysis with user data for enhanced insights.

    Args:
        image_paths: Paths to pose images
        user_profile: Dict with height, weight, age, fitness_goals, etc.
    """
    # First, get visual analysis
    visual_analysis = analyze_body_composition(
        image_paths=image_paths,
        pose_labels=["Front", "Side", "Back"],
        user_metadata=user_profile
    )

    # Calculate BMI
    height_m = user_profile['height_cm'] / 100
    bmi = user_profile['weight_kg'] / (height_m ** 2)

    # Estimate lean body mass based on BF%
    body_fat_kg = user_profile['weight_kg'] * (visual_analysis['estimated_body_fat_percentage'] / 100)
    lean_mass_kg = user_profile['weight_kg'] - body_fat_kg

    # Combine data
    enhanced_result = {
        **visual_analysis,
        "user_metrics": {
            "height_cm": user_profile['height_cm'],
            "weight_kg": user_profile['weight_kg'],
            "age": user_profile['age'],
            "bmi": round(bmi, 1),
            "estimated_body_fat_kg": round(body_fat_kg, 1),
            "estimated_lean_mass_kg": round(lean_mass_kg, 1)
        },
        "analysis_timestamp": "2025-12-08T12:00:00Z"
    }

    return enhanced_result
```

---

## 7. Best Practices Summary

### 7.1 Image Preparation
- ✅ Use consistent lighting across all poses
- ✅ Ensure subject is in form-fitting clothing or minimal clothing
- ✅ Use neutral background to avoid distractions
- ✅ Maintain consistent distance from camera for all poses
- ✅ Resize images to reasonable dimensions (e.g., 1024x1024) to save tokens

### 7.2 Prompt Engineering
- ✅ Use role assignment to frame Claude's expertise
- ✅ Provide consent context to reduce medical disclaimers
- ✅ Request step-by-step thinking in `<thinking>` tags
- ✅ Use few-shot examples for consistency
- ✅ Specify exact JSON structure in prompt or use tool schemas
- ✅ Ask for confidence levels and reasoning

### 7.3 Structured Outputs
- ✅ Use tool use with `input_schema` for guaranteed JSON
- ✅ Define Pydantic models for type safety
- ✅ Include enums for categorical values
- ✅ Mark required vs optional fields
- ✅ Extract tool_use results from response.content

### 7.4 Cost Optimization
- ✅ Use `cache_control` for system prompts and guidelines
- ✅ Resize images before encoding to reduce token usage
- ✅ Use `/messages/count_tokens` to preview costs
- ✅ Consider Haiku for simple classification tasks
- ✅ Use Sonnet for detailed multi-image analysis

### 7.5 Handling Limitations
- ✅ Always include confidence levels in output
- ✅ Acknowledge analysis limitations
- ✅ Combine visual analysis with other data (weight, height, age)
- ✅ Use ranges instead of single-point estimates when appropriate
- ✅ Provide context that a professional will review results

---

## 8. Example Response Format

```json
{
  "estimated_body_fat_percentage": 15.5,
  "body_fat_range": {
    "min": 14,
    "max": 17
  },
  "confidence_level": "high",
  "confidence_reasoning": "Clear muscle definition, visible abs, low subcutaneous fat. All three angles provide consistent visual markers.",
  "muscle_mass_assessment": "athletic",
  "visual_markers_observed": [
    "Visible abdominal definition (4-pack visible)",
    "Shoulder striations visible",
    "Minimal love handles",
    "Quad separation visible",
    "Minimal chest fat"
  ],
  "pose_specific_observations": {
    "front": "Clear abdominal definition with visible rectus abdominis. Shoulder and arm vascularity present. Minimal chest fat.",
    "side": "Flat stomach profile, no significant abdominal protrusion. Clear lat development.",
    "back": "Visible back definition, Christmas tree pattern emerging. Minimal lower back fat."
  },
  "recommendations": [
    "Maintain current body composition for athletic performance",
    "Continue strength training to preserve muscle mass",
    "Consider slight caloric surplus if goal is muscle gain",
    "Monitor progress with monthly check-ins"
  ],
  "user_metrics": {
    "height_cm": 180,
    "weight_kg": 80,
    "age": 30,
    "bmi": 24.7,
    "estimated_body_fat_kg": 12.4,
    "estimated_lean_mass_kg": 67.6
  },
  "analysis_timestamp": "2025-12-08T12:00:00Z"
}
```

---

## 9. Integration Considerations

### 9.1 Dashboard Integration
- Store analysis results in database with timestamps
- Track progress over time with historical comparisons
- Visualize trends in body fat %, lean mass, etc.
- Allow coaches to override/adjust AI estimates

### 9.2 User Experience
- Show confidence levels clearly to users
- Provide educational context about body fat ranges
- Combine AI analysis with other metrics (WHOOP, nutrition data)
- Allow users to re-submit with better photos if confidence is low

### 9.3 Privacy & Consent
- Obtain explicit consent for image analysis
- Store images securely with encryption
- Provide option to delete images after analysis
- Comply with HIPAA if applicable (healthcare context)

### 9.4 Validation & Calibration
- Compare AI estimates with DEXA scans, calipers, or other methods
- Track accuracy over time
- Adjust prompts based on real-world feedback
- Consider human-in-the-loop for edge cases

---

## 10. References

- **Anthropic API Documentation**: https://platform.claude.com/docs/en/api/messages
- **Anthropic Cookbook - Vision Examples**: https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal
- **Token Counting API**: https://platform.claude.com/docs/en/api/messages/count_tokens
- **Prompt Caching Guide**: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- **Claude Vision Best Practices**: https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best_practices_for_vision.ipynb

---

## 11. Next Steps for Implementation

1. **Set up test environment** with sample physique images
2. **Create prompt templates** for different analysis types
3. **Build tool schema** for structured JSON output
4. **Implement API wrapper** with error handling and retries
5. **Test accuracy** against known body fat measurements
6. **Integrate with dashboard** backend
7. **Add UI components** for image upload and results display
8. **Implement progress tracking** over time
9. **Add coach review workflow** for validation
10. **Monitor costs** and optimize token usage

---

**Document Version:** 1.0
**Last Updated:** 2025-12-08
**Author:** AI Research (Claude Code)
