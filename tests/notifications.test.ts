import { describe, expect, it } from 'vitest';
import { resolveTemplateVariables, resolveTemplateVariablesHtml } from '../lib/notifications';

describe('notification template variable helpers', () => {
  it('resolves plain-text variables without HTML escaping', () => {
    expect(resolveTemplateVariables('Lead: {{name}} / {{missing}}', {
      name: '<Sam & Co>',
    })).toBe('Lead: <Sam & Co> / {{missing}}');
  });

  it('escapes HTML variable values while preserving trusted template markup', () => {
    const html = resolveTemplateVariablesHtml('<p>{{name}}</p>', {
      name: `<Sam & "Co"'>`,
    });

    expect(html).toBe('<p>&lt;Sam &amp; &quot;Co&quot;&#39;&gt;</p>');
  });
});
