import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../generator.js';
import { spy } from 'sinon';

const mock = await readFile({ path: './generator.mock.html' });
document.body.innerHTML = mock;
window.alert = spy();

describe('Sidekick Generator', () => {
  it('has a form', () => {
    const generator = document.querySelector('.sidekick-generator');
    decorate(generator);
    const form = generator.querySelector('form');
    expect(form).to.exist;
    const giturl = generator.querySelector('#giturl');
    expect(giturl).to.exist;
    const submit = generator.querySelector('#generator');
    expect(submit).to.exist;
  });

  it('refuses to run without repository url', () => {
    const generator = document.querySelector('.sidekick-generator');
    decorate(generator);
    generator.querySelector('#generator').click();
    expect(window.alert.calledWith('Repository URL is mandatory.')).to.be.true;
    const bookmark = generator.querySelector('#bookmark');
    expect(bookmark.getAttribute('href')).to.equal('#');
  });

  it('displays a sidekick bookmarklet link', () => {
    const generator = document.querySelector('.sidekick-generator');
    decorate(generator);
    generator.querySelector('#giturl').value = 'https://github.com/adobe/foo-website';
    generator.querySelector('#project').value = 'Foo';
    generator.querySelector('#generator').click();
    const bookmark = generator.querySelector('#bookmark');
    expect(bookmark).to.exist;
    expect(bookmark.textContent).to.equal('Foo Sidekick');
  });

  it('autoruns with query parameters', () => {
    history.pushState({}, '',
      `${window.location.href}&from=https%3A%2F%2Fwww.adobe.com%2F&giturl=https%3A%2F%2Fgithub.com%2Fadobe%2Ffoo-website&project=Foo&hlx3=true`)
    const generator = document.querySelector('.sidekick-generator');
    decorate(generator);
    const formContainer = generator.querySelector('#form-container');
    expect(formContainer.classList.contains('hidden')).to.be.true;
    const bookmark = generator.querySelector('#bookmark');
    expect(bookmark).to.exist;
    expect(bookmark.textContent).to.equal('Foo Sidekick');
    const backLink = generator.querySelector(':scope a.back-link');
    expect(backLink).to.exist;
    expect(backLink.href).to.equal('https://www.adobe.com/');
  });

  it('displays help if sidkeick bookmarklet link is clicked', () => {
    history.pushState({}, '',
      `${window.location.href}&&giturl=https%3A%2F%2Fgithub.com%2Fadobe%2Ffoo-website&project=Foo`)
    const generator = document.querySelector('.sidekick-generator');
    decorate(generator);
    const bookmark = generator.querySelector('#bookmark');
    bookmark.click();
    expect(window.alert.calledWith('Instead of clicking this button, you need to drag it to your browser\'s bookmark bar.')).to.be.true;
  });
});
