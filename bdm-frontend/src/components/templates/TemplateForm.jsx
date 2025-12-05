
import { FormGroup } from '../common';

export function TemplateForm({
  templateName,
  templateType,
  description,
  onTemplateNameChange,
  onTemplateTypeChange,
  onDescriptionChange
}) {
  return (
    <div>
      <FormGroup label="Template Name" required>
        <input
          type="text"
          placeholder="Template Name *"
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          className="form-input"
          required
        />
      </FormGroup>

      <FormGroup label="Document Type" required>
        <input
          type="text"
          placeholder="Document Type *"
          value={templateType}
          onChange={(e) => onTemplateTypeChange(e.target.value)}
          className="form-input"
          required
        />
      </FormGroup>

      <FormGroup label="Description">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="form-textarea"
          rows="2"
        />
      </FormGroup>
    </div>
  );
}

