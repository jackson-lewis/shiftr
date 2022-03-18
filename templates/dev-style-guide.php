<?php 
/**
 * Template name: Development Style Guide
 * 
 * @since v1.6.1
 */
get_header();
?>
<style>
    .template-dev-style-guide main.site-main {
         padding-bottom: 100px;
    }

    .shftr_dev_style_guide-colors {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .shftr_dev_style_guide-colors div {
        width: 15%;
        padding-top: 15%;
        margin: 10px;

        border-radius: var(--border-radius);
        box-shadow: 0 0 16px rgba(0,0,0,.2);
    }

    .shftr_dev_style_guide-buttons_wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .shftr_dev_style_guide-buttons_wrapper div {
        margin: 10px;
    }

    code {
        padding: 2px;

        background-color: #eee;
        border-radius: var(--border-radius);
    }

    .shftr_dev_style_guide-form .field {
        margin-bottom: 20px;
    }

    .border-radius-test {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .border-radius-test div {
        width: 40%;
        height: 100px;
        display: grid;
        align-items: center;

        text-align: center;
        color: var(--c-white);
        font-weight: 700;
        font-size: 1.5rem;
        background-color: var(--c-black);
        border-radius: var(--border-radius);
    }
    .border-radius-test div.x2 {
        border-radius: calc( var(--border-radius) * 2 );
    }

</style>

<main class="site-main">
    <div class="hero--standard">
        <div class="hero-content">
            <div class="container">
                <h1>Development Style Guide</h1>
                <p>The purpose of this style guide is to provide an overview of all core elements, such as typography, buttons and inputs.</p>
            </div>
        </div>
    </div>

    <section class="site-section">
        <article class="container content">
            <h2>Colors</h2>
            <div class="shftr_dev_style_guide-colors">
                <div style="background-color:var(--c-primary);"></div>
                <div style="background-color:var(--c-secondary);"></div>
                <div style="background-color:var(--c-l-grey);"></div>
                <div style="background-color:var(--c-white);"></div>
                <div style="background-color:var(--c-black);"></div>
            </div>
            <h2>Headings</h2>
            <p>Please note, heading <code>line-height</code> and <code>font-size</code> are set globally, however any margins are scoped within the <code>.content</code> wrapper.</p>
            <h1>Heading 1</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h2>Heading 2</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h3>Heading 3</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h4>Heading 4</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h5>Heading 5</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h6>Heading 6</h6>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <hr>
            <h2>Body text and inline links</h2>
            <p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis <a href="/">nostrud exercitation</a> ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, <a href="/">consectetur</a> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in <strong>reprehenderit</strong> in voluptate velit esse cillum dolore eu fugiat <a href="/">nulla pariatur</a>. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <hr>
            <h2>Lists</h2>
            <h3>Unordered list</h3>
            <ul>
                <li>List item 1.</li>
                <li>List item 2.</li>
                <li>List item 3.</li>
            </ul>
            <h3>Ordered list</h3>
            <ol>
                <li>List item 1.</li>
                <li>List item 2.</li>
                <li>List item 3.</li>
            </ol>
            <hr>
            <h2>Buttons</h2>
            <p>Also ensure all button states are correctly configured, this includes: hover, active, focus.</p>
            <div class="shftr_dev_style_guide-buttons_wrapper">
                <div>
                    <a href="/" class="button">Button standard</a>
                </div>
                <div>
                    <a href="/" class="button--secondary">Button secondary</a>
                </div>
                <div>
                    <a href="/" class="button--text">Button text</a>
                </div>
            </div>
            <hr>
            <h2>Forms/inputs</h2>
            <p>Ensure state/event styles are all correctly configured, this includes: focus, blur, validate, error.</p>
            <form class="shftr_dev_style_guide-form">
                <div class="field">
                    <label for="">Text/email/tel</label>
                    <input type="text" placeholder="Text input field" class="form-input">
                </div>
                <div class="field">
                    <label for="">Select</label>
                    <select class="form-select">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                    </select>
                </div>
                <div class="field">
                    <label for="">Textarea</label>
                    <textarea name="" id="" rows="10" class="form-textarea" placeholder="Textarea field"></textarea>
                </div>
                <div class="field field-type--radio">
                    <label for="">Radio</label>
                    <div class="sub-field--radio">
                        <input type="radio" name="radio" id="radio1">
                        <label for="radio1">
                            Radio option 1
                            <span class="custom-radio"></span>
                        </label>
                    </div>
                    <div class="sub-field--radio">
                        <input type="radio" name="radio" id="radio2">
                        <label for="radio2">
                            Radio option 2
                            <span class="custom-radio"></span>
                        </label>
                    </div>
                </div>
                <div class="field">
                    <label for="">Checkbox</label>
                    <div class="field-type--checkbox">
                        <input type="checkbox" id="checkbox">
                        <label for="checkbox">
                            Checkbox option
                            <span class="custom-checkbox"></span>
                        </label>
                    </div>
                </div>
            </form>
            <hr>
            <h2>Border radius</h2>
            <p>Shiftr comes with the global css variable <code>--border-radius</code>, which provides easy control of a border radius across a website. See the border radius here. For instances where a greater radius is used, try to still use the css variable, but with a multipler in a <code>calc()</code> function. Example below.</p>
            <p><code>border-radius: calc( var(--border-radius) * 2 );</code></p>
            <div class="border-radius-test">
                <div><span>1x</span></div>
                <div class="x2"><span>2x</span></div>
            </div>
        </article>
    </section>

</main>
    

<?php get_footer(); ?>
