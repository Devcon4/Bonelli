import { LitElement } from 'lit-element';
import comp from './paragraph.component';

describe('paragraph test', () => {
  const component = 'bn-paragraph';
  let paragraph: LitElement;

  const getShadowRoot = (tagName: string): ShadowRoot => {
    return document.body.getElementsByTagName(tagName)[0].shadowRoot;
  };

  beforeEach(() => {
    paragraph = window.document.createElement(component) as LitElement;
    document.body.appendChild(paragraph);
  });

  afterEach(() => {
    document.body.getElementsByTagName(component)[0].remove();
  });

  it('should create', () => {
    console.log(customElements.get('bn-paragraph'));
    let child = document.createElement('p');
    child.id = 'inner';
    child.innerText = 'inner stuff!';
    paragraph.appendChild(child);
    const inner = getShadowRoot(component).getElementById('inner');
    expect(paragraph.getElementsByClassName('paragraph')).toBeTruthy();
    console.log(paragraph);
    expect(inner).toBeTruthy();
    expect(inner.innerText).toEqual('inner stuff!');
    expect(paragraph).toMatchInlineSnapshot(`
      <bn-paragraph>
        <p
          id="inner"
        >
          inner stuff!
        </p>
      </bn-paragraph>
    `);
  });
});
