const UserPage = (function(){
  const numpad = {
    layout : 'custom',
    restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
    preventPaste : true,  // prevent ctrl-v and right click
    autoAccept : true,
    display: {
      'bksp'   :  "\u232B",
      'accept' : 'Submit'
    },
    customLayout : {
      'normal': [
      '1 2 3',
      '4 5 6',
      '7 8 9',
      '{bksp} 0 {accept}'
      ]
    },
    visible : function(event, keyboard, el) {
      customKeyboardChanges("numpad");
    }
  };
    
  const kboard = {
    display: {
      'bksp'   :  "\u232B",
      'accept' : 'Submit',
      'normal' : 'ABC',
      'meta1'  : '123',
      'meta2'  : '#+='
    },
    layout: 'custom',
    customLayout: {
      'normal': [
        'q w e r t y u i o p',
        'a s d f g h j k l',
        '{s} z x c v b n m {bksp}',
        '{meta1} {space} {accept}'
      ],
      'shift': [
        'Q W E R T Y U I O P',
        'A S D F G H J K L',
        '{s} Z X C V B N M {bksp}',
        '{meta1} {space} {accept}'
      ],
      'meta1': [
        '1 2 3 4 5 6 7 8 9 0',
        '- / : ; ( ) \u20ac & @',
        '{meta2} . , ? ! \' {bksp}',
        '{normal} {space} {accept}'
      ],
      'meta2': [
        '[ ] { } # % ^ * + =',
        '_ \\ | ~ < > $ \u00a3 \u00a5',
        '{meta1} . , ? ! \' {bksp}',
        '{normal} {space} {accept}'
      ]
    },
    beforeVisible: function(event, keyboard, el) {
      keyboard.$keyboard
        .click(function(){
          console.log("click off keys")
        });
    },
    initialized : function(event, keyboard, el) {
      console.log('keyboard plugin initialized');
    },
    visible : function(event, keyboard, el) {
      customKeyboardChanges("kboard");
    }
  };
    
  const root = document.createElement('div');
  root.classList = 'mdc-layout-grid__inner';
  root.style = "display: flex; justify-content: center;"
  root.innerHTML = `
        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop">                
          <div class="mdc-layout-grid__inner">
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-12-desktop">
              <div style="display:flex; justify-content:center" class="mdc-typography--body1"> Enter information, then select leg for treatment.</div>
            </div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop" style="height:50px;">
              <label id="name-input" class="mdc-text-field mdc-text-field--outlined mdc-text-field--short">
                <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                <span class="mdc-floating-label" id="input__name">Name</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
                </span>
                <input id="finput__name" type="text" class="mdc-text-field__input" aria-labelledby="input__name">
              </label>
            </div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop" style="height:50px;">
              <label id="height-input" class="mdc-text-field mdc-text-field--outlined mdc-text-field--short"\>
                <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                <span class="mdc-floating-label" id="input__height">Height</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
                </span>
                <input type="text" id="finput__height" class="mdc-text-field__input" aria-labelledby="input__height">
              </label>
            </div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop" style="height:50px;">
              <label id="age-input" class="mdc-text-field mdc-text-field--outlined mdc-text-field--short">
                <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                <span class="mdc-floating-label" id="input__age">Age</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
                </span>
                <input type="text" id="finput__age" class="mdc-text-field__input" aria-labelledby="input__age">
              </label>
            </div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop" style="height:50px;">
              <label id="weight-input" class="mdc-text-field mdc-text-field--outlined mdc-text-field--short">
                <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                    <span class="mdc-floating-label" id="input__weight">Weight</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
                </span>
                <input type="text" id="finput__weight" class="mdc-text-field__input" aria-labelledby="input__weight">
              </label>
            </div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-12-desktop" style="display:flex; justify-content:center">
              <div class="mdc-form-field ">
                <div class="mdc-touch-target-wrapper">
                  <div class="mdc-radio mdc-radio--touch">
                    <input id="male-radio" class="mdc-radio__native-control" type="radio" name="gender" checked>
                    <div class="mdc-radio__background">
                      <div class="mdc-radio__outer-circle"></div>
                      <div class="mdc-radio__inner-circle"></div>
                    </div>
                    <div class="mdc-radio__ripple"></div>
                    </div>
                  </div>
                <label for="male-radio">Male</label>
              </div>
              <div class="mdc-form-field">
                <div class="mdc-touch-target-wrapper">
                  <div class="mdc-radio mdc-radio--touch">
                    <input id="female-radio" class="mdc-radio__native-control" type="radio" name="gender" checked>
                    <div class="mdc-radio__background">
                      <div class="mdc-radio__outer-circle"></div>
                      <div class="mdc-radio__inner-circle"></div>
                    </div>
                    <div class="mdc-radio__ripple"></div>
                  </div>
                  </div>
                <label for="female-radio">Female</label>
              </div>
            </div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-12-desktop">
                    <label id="history-input" class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" style="width: 100%;">
                        <span class="mdc-notched-outline">
                            <span class="mdc-notched-outline__leading"></span>
                            <span class="mdc-notched-outline__notch">
                                <span class="mdc-floating-label" id="input__history">History</span>
                            </span>
                            <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        <input type="text" id="finput__history" class="mdc-text-field__input" aria-label="History"></textarea>
                    </label>
                </div>
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-12-desktop">
                    <label id="misc-input" class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" style="width: 100%;">
                        <span class="mdc-notched-outline">
                            <span class="mdc-notched-outline__leading"></span>
                            <span class="mdc-notched-outline__notch">
                                <span class="mdc-floating-label" id="input__misc">Misc</span>
                            </span>
                            <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        <input type="text" id="finput__misc" class="mdc-text-field__input" aria-label="Misc"></textarea>
                    </label>
                </div>
                <div class="mdc-radio__ripple"></div>
              </div>

              <div class="mdc-layout-grid__inner">
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop">        
                <button
                  id="LeftLeg"
                  class="mdc-button mdc-button--outlined mdc-button--touch"
                  style="width: 100%;"
                >
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">Left Leg</span>
                  <div class="mdc-button__touch"></div>
                </button>
              </div>
    
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-6-desktop">        
                <button
                  id="RightLeg"
                  class="mdc-button mdc-button--outlined mdc-button--touch"
                  style="width: 100%;"
                >
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">Right Leg</span>
                  <div class="mdc-button__touch"></div>
                </button>
              </div>
            </div>    
          </div>
        </div>
      </div>
  `;

  function onEnter(){
    const parent = document.getElementById('page-content')
    // replace parent content
    parent.innerHTML = '';
    parent.append(root);
    // attach MDC javascript
    initMDC();
    // attach event listeners
    attachEvents();
    document.addEventListener('appData',onUpdate);
    onUpdate();
  }

  function onUpdate() {

    const {user_name} = appData;
    const {user_weight} = appData;
    const {user_age} = appData;
    const {user_height} = appData;
    const {user_misc} = appData;
    const {user_history} = appData;

    let userName = document.getElementById("finput__name");
    let userWeight = document.getElementById("finput__weight");
    let userAge = document.getElementById("finput__age");
    let userHeight = document.getElementById("finput__height");
    let userMisc= document.getElementById("finput__misc");
    let userHistory = document.getElementById("finput__history");

    if(user_name){
      userName.innerHTML = user_name;
    }
    if(user_weight){
      userWeight.innerHTML = user_weight;
    }
    if(user_age){
      userAge.innerHTML = user_age;
    }
    if(user_height){
      userHeight.innerHTML = user_height;
    }
    if(user_misc){
      userMisc.innerHTML = user_misc;
    }
    if(user_history){
      userHistory.innerHTML = user_history;
    }

    // leg selection
    let leftLeg = document.getElementById("LeftLeg");
    let rightLeg = document.getElementById("RightLeg");
     if (appData.leg == "left") {
      leftLeg.classList.add('mdc-button--raised');
      leftLeg.classList.remove('mdc-button--outlined');
      rightLeg.classList.remove('mdc-button--raised');
      rightLeg.classList.add('mdc-button--outlined');
      } else  {
      leftLeg.classList.remove('mdc-button--raised');
      leftLeg.classList.add('mdc-button--outlined');
      rightLeg.classList.add('mdc-button--raised');
      rightLeg.classList.remove('mdc-button--outlined');
      }
      if(!appData.testActive && !appData.detecting && !appData.tightening && !appData.loosening 
      && appData.treatmentState == "stopped" && (appData.num_lower + appData.num_upper) > 0)
      {
      rightLeg.disabled = false;
      leftLeg.disabled = false;
      }else{
      rightLeg.disabled = true;
      leftLeg.disabled = true;
      }
  }

  function onExit() {
    document.removeEventListener('appData',onUpdate);
  }

  function initMDC() {
    // text fields
    [...root.querySelectorAll('.mdc-text-field')]
      .map(el => new mdc.textField.MDCTextField(el));
    // form fields
    [...root.querySelectorAll('.mdc-form-field')]
      .map(el => new mdc.formField.MDCFormField(el));
    // radio
    [...root.querySelectorAll('.mdc-radio')]
      .map(el => new mdc.radio.MDCRadio(el));
    // ripple
    [...root.querySelectorAll('.mdc-radio')]
      .map(el => new mdc.ripple.MDCRipple(el));
  }

  function attachEvents() {
    let a = document.createElement('input')
    a.id = 'hello'
    a.style.display = "none"
    document.body.append(a)
    $(a).keyboard()

    $('#finput__name').keyboard(kboard);
    $('#finput__name').keyboard({
      beforeVisible : function(event, keyboard, el) {
        
      }
    });
    $('#finput__weight').keyboard(numpad);
    $('#finput__age').keyboard(numpad);
    $('#finput__height').keyboard(numpad);
    $('#finput__misc').keyboard(kboard);
    $('#finput__history').keyboard(kboard);

    $('#finput__name').bind('beforeClose', (e, kb, el, ac) => {
      sendAppEventValue('user_name', kb.last.val); 
      document.getElementById('input__name').click();
    });
    $('#finput__weight').bind('beforeClose', (e, kb, el, ac) => {
      sendAppEventValue('user_weight', kb.last.val); 
      document.getElementById('input__weight').click();
    });
    $('#finput__age').bind('beforeClose', (e, kb, el, ac) => {
      sendAppEventValue('user_age', kb.last.val); 
      document.getElementById('input__age').click();
    });
    $('#finput__height').bind('beforeClose', (e, kb, el, ac) => {
      sendAppEventValue('user_height', kb.last.val); 
      document.getElementById('input__height').click();    
    });
    $('#finput__misc').bind('beforeClose', (e, kb, el, ac) => {
      sendAppEventValue('user_misc', kb.last.val); 
      console.log('weight: before close\n',"\ne\n", e,"\nkb.last.val\n", kb.last.val,"\nel\n", el,"\nac\n", ac); 
      document.getElementById('input__misc').click();    
    });
    $('#finput__history').bind('beforeClose', (e, kb, el, ac) => {
      sendAppEventValue('user_hist', kb.last.val); 
      console.log('weight: before close\n',"\ne\n", e,"\nkb.last.val\n", kb.last.val,"\nel\n", el,"\nac\n", ac); 
      document.getElementById('input__history').click();    
    });

 
    [...root.querySelectorAll('.mdc-text-field')]
      .map(el => el.addEventListener('focus', console.log('hello')));
    addTouchAndMouseEvents(document.getElementById('RightLeg'), startTouchEvent, moveTouchEvent, () => { setLeg('right') });
    addTouchAndMouseEvents(document.getElementById('LeftLeg'), startTouchEvent, moveTouchEvent, () => { setLeg('left') });    
  }
  
  // L_A: break above code into here 
  /*function attachKeyboard(elID, AppEventValue){

  }*/

  function customKeyboardChanges(layout){
    let inputPreview = document.querySelector(".ui-keyboard-preview");
    inputPreview.classList.add(`keyboard-layout-${layout}`);
    const $icon = document.querySelector('.icon');
    const $arrow = document.querySelector('.arrow');
    
    $icon.onclick = () => {
      $arrow.animate([
        {left: '0'},
        {left: '10px'},
        {left: '0'}
      ],{
        duration: 700,
        iterations: Infinity
      });
    }    
  }

  function setLeg(val) {
    sendAppEventString('leg',val);
  }

  return {
    onEnter,
    onUpdate,
    onExit,
    title: 'User',
    icon: 'account_circle',
  }
})()

// NOTE: SDC this function is never called
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } 
  else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
