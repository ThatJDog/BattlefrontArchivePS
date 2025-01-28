// Generated from PDML.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import PDMLListener from './PDMLListener.js';
const serializedATN = [4,1,22,194,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,1,0,1,0,1,0,1,1,1,1,3,1,22,8,1,1,2,1,2,5,2,26,
8,2,10,2,12,2,29,9,2,1,2,5,2,32,8,2,10,2,12,2,35,9,2,1,2,5,2,38,8,2,10,2,
12,2,41,9,2,1,2,1,2,5,2,45,8,2,10,2,12,2,48,9,2,1,3,1,3,1,3,5,3,53,8,3,10,
3,12,3,56,9,3,1,3,1,3,5,3,60,8,3,10,3,12,3,63,9,3,5,3,65,8,3,10,3,12,3,68,
9,3,1,3,1,3,1,4,1,4,1,4,5,4,75,8,4,10,4,12,4,78,9,4,1,4,1,4,1,5,1,5,1,5,
5,5,85,8,5,10,5,12,5,88,9,5,1,5,1,5,5,5,92,8,5,10,5,12,5,95,9,5,5,5,97,8,
5,10,5,12,5,100,9,5,1,5,1,5,5,5,104,8,5,10,5,12,5,107,9,5,1,6,1,6,5,6,111,
8,6,10,6,12,6,114,9,6,1,6,1,6,5,6,118,8,6,10,6,12,6,121,9,6,1,6,1,6,5,6,
125,8,6,10,6,12,6,128,9,6,1,7,1,7,1,7,1,7,1,7,1,7,5,7,136,8,7,10,7,12,7,
139,9,7,1,7,1,7,5,7,143,8,7,10,7,12,7,146,9,7,1,7,5,7,149,8,7,10,7,12,7,
152,9,7,3,7,154,8,7,1,7,5,7,157,8,7,10,7,12,7,160,9,7,1,7,1,7,1,7,5,7,165,
8,7,10,7,12,7,168,9,7,1,7,1,7,5,7,172,8,7,10,7,12,7,175,9,7,1,7,5,7,178,
8,7,10,7,12,7,181,9,7,3,7,183,8,7,1,7,5,7,186,8,7,10,7,12,7,189,9,7,1,7,
3,7,192,8,7,1,7,0,0,8,0,2,4,6,8,10,12,14,0,0,216,0,16,1,0,0,0,2,21,1,0,0,
0,4,23,1,0,0,0,6,49,1,0,0,0,8,71,1,0,0,0,10,81,1,0,0,0,12,108,1,0,0,0,14,
191,1,0,0,0,16,17,3,2,1,0,17,18,5,0,0,1,18,1,1,0,0,0,19,22,3,4,2,0,20,22,
3,10,5,0,21,19,1,0,0,0,21,20,1,0,0,0,22,3,1,0,0,0,23,27,3,6,3,0,24,26,5,
22,0,0,25,24,1,0,0,0,26,29,1,0,0,0,27,25,1,0,0,0,27,28,1,0,0,0,28,33,1,0,
0,0,29,27,1,0,0,0,30,32,3,2,1,0,31,30,1,0,0,0,32,35,1,0,0,0,33,31,1,0,0,
0,33,34,1,0,0,0,34,39,1,0,0,0,35,33,1,0,0,0,36,38,5,22,0,0,37,36,1,0,0,0,
38,41,1,0,0,0,39,37,1,0,0,0,39,40,1,0,0,0,40,42,1,0,0,0,41,39,1,0,0,0,42,
46,3,8,4,0,43,45,5,22,0,0,44,43,1,0,0,0,45,48,1,0,0,0,46,44,1,0,0,0,46,47,
1,0,0,0,47,5,1,0,0,0,48,46,1,0,0,0,49,50,5,1,0,0,50,54,5,16,0,0,51,53,5,
22,0,0,52,51,1,0,0,0,53,56,1,0,0,0,54,52,1,0,0,0,54,55,1,0,0,0,55,66,1,0,
0,0,56,54,1,0,0,0,57,61,3,12,6,0,58,60,5,22,0,0,59,58,1,0,0,0,60,63,1,0,
0,0,61,59,1,0,0,0,61,62,1,0,0,0,62,65,1,0,0,0,63,61,1,0,0,0,64,57,1,0,0,
0,65,68,1,0,0,0,66,64,1,0,0,0,66,67,1,0,0,0,67,69,1,0,0,0,68,66,1,0,0,0,
69,70,5,2,0,0,70,7,1,0,0,0,71,72,5,3,0,0,72,76,5,16,0,0,73,75,5,22,0,0,74,
73,1,0,0,0,75,78,1,0,0,0,76,74,1,0,0,0,76,77,1,0,0,0,77,79,1,0,0,0,78,76,
1,0,0,0,79,80,5,2,0,0,80,9,1,0,0,0,81,82,5,1,0,0,82,86,5,16,0,0,83,85,5,
22,0,0,84,83,1,0,0,0,85,88,1,0,0,0,86,84,1,0,0,0,86,87,1,0,0,0,87,98,1,0,
0,0,88,86,1,0,0,0,89,93,3,12,6,0,90,92,5,22,0,0,91,90,1,0,0,0,92,95,1,0,
0,0,93,91,1,0,0,0,93,94,1,0,0,0,94,97,1,0,0,0,95,93,1,0,0,0,96,89,1,0,0,
0,97,100,1,0,0,0,98,96,1,0,0,0,98,99,1,0,0,0,99,101,1,0,0,0,100,98,1,0,0,
0,101,105,5,4,0,0,102,104,5,22,0,0,103,102,1,0,0,0,104,107,1,0,0,0,105,103,
1,0,0,0,105,106,1,0,0,0,106,11,1,0,0,0,107,105,1,0,0,0,108,112,5,16,0,0,
109,111,5,22,0,0,110,109,1,0,0,0,111,114,1,0,0,0,112,110,1,0,0,0,112,113,
1,0,0,0,113,115,1,0,0,0,114,112,1,0,0,0,115,119,5,12,0,0,116,118,5,22,0,
0,117,116,1,0,0,0,118,121,1,0,0,0,119,117,1,0,0,0,119,120,1,0,0,0,120,122,
1,0,0,0,121,119,1,0,0,0,122,126,3,14,7,0,123,125,5,22,0,0,124,123,1,0,0,
0,125,128,1,0,0,0,126,124,1,0,0,0,126,127,1,0,0,0,127,13,1,0,0,0,128,126,
1,0,0,0,129,192,5,11,0,0,130,192,5,20,0,0,131,192,5,9,0,0,132,192,5,10,0,
0,133,137,5,5,0,0,134,136,5,22,0,0,135,134,1,0,0,0,136,139,1,0,0,0,137,135,
1,0,0,0,137,138,1,0,0,0,138,153,1,0,0,0,139,137,1,0,0,0,140,150,3,12,6,0,
141,143,5,22,0,0,142,141,1,0,0,0,143,146,1,0,0,0,144,142,1,0,0,0,144,145,
1,0,0,0,145,147,1,0,0,0,146,144,1,0,0,0,147,149,3,12,6,0,148,144,1,0,0,0,
149,152,1,0,0,0,150,148,1,0,0,0,150,151,1,0,0,0,151,154,1,0,0,0,152,150,
1,0,0,0,153,140,1,0,0,0,153,154,1,0,0,0,154,158,1,0,0,0,155,157,5,22,0,0,
156,155,1,0,0,0,157,160,1,0,0,0,158,156,1,0,0,0,158,159,1,0,0,0,159,161,
1,0,0,0,160,158,1,0,0,0,161,192,5,6,0,0,162,166,5,7,0,0,163,165,5,22,0,0,
164,163,1,0,0,0,165,168,1,0,0,0,166,164,1,0,0,0,166,167,1,0,0,0,167,182,
1,0,0,0,168,166,1,0,0,0,169,179,3,14,7,0,170,172,5,22,0,0,171,170,1,0,0,
0,172,175,1,0,0,0,173,171,1,0,0,0,173,174,1,0,0,0,174,176,1,0,0,0,175,173,
1,0,0,0,176,178,3,14,7,0,177,173,1,0,0,0,178,181,1,0,0,0,179,177,1,0,0,0,
179,180,1,0,0,0,180,183,1,0,0,0,181,179,1,0,0,0,182,169,1,0,0,0,182,183,
1,0,0,0,183,187,1,0,0,0,184,186,5,22,0,0,185,184,1,0,0,0,186,189,1,0,0,0,
187,185,1,0,0,0,187,188,1,0,0,0,188,190,1,0,0,0,189,187,1,0,0,0,190,192,
5,8,0,0,191,129,1,0,0,0,191,130,1,0,0,0,191,131,1,0,0,0,191,132,1,0,0,0,
191,133,1,0,0,0,191,162,1,0,0,0,192,15,1,0,0,0,27,21,27,33,39,46,54,61,66,
76,86,93,98,105,112,119,126,137,144,150,153,158,166,173,179,182,187,191];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class PDMLParser extends antlr4.Parser {

    static grammarFileName = "PDML.g4";
    static literalNames = [ null, "'<'", "'>'", "'</'", "'/>'", "'{'", "'}'", 
                            "'['", "']'", null, null, null, "'='" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, "STRING_LITERAL", "HEX_COLOR", "BOOL_LITERAL", 
                             "ASSIGN", "COMMENT", "SINGLE_COMMENT", "MULTI_COMMENT", 
                             "IDFR", "INT", "DOUBLE", "SIGNED_INT", "SIGNED_DOUBLE", 
                             "NUMBER", "WS" ];
    static ruleNames = [ "grammarSpec", "body", "tag", "open_tag", "close_tag", 
                         "self_closing_tag", "valueAssignment", "value" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = PDMLParser.ruleNames;
        this.literalNames = PDMLParser.literalNames;
        this.symbolicNames = PDMLParser.symbolicNames;
    }



	grammarSpec() {
	    let localctx = new GrammarSpecContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, PDMLParser.RULE_grammarSpec);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 16;
	        this.body();
	        this.state = 17;
	        this.match(PDMLParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	body() {
	    let localctx = new BodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, PDMLParser.RULE_body);
	    try {
	        this.state = 21;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 19;
	            this.tag();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 20;
	            this.self_closing_tag();
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	tag() {
	    let localctx = new TagContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, PDMLParser.RULE_tag);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 23;
	        this.open_tag();
	        this.state = 27;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,1,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 24;
	                this.match(PDMLParser.WS); 
	            }
	            this.state = 29;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,1,this._ctx);
	        }

	        this.state = 33;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===1) {
	            this.state = 30;
	            this.body();
	            this.state = 35;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 39;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===22) {
	            this.state = 36;
	            this.match(PDMLParser.WS);
	            this.state = 41;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 42;
	        this.close_tag();
	        this.state = 46;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,4,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 43;
	                this.match(PDMLParser.WS); 
	            }
	            this.state = 48;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,4,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	open_tag() {
	    let localctx = new Open_tagContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, PDMLParser.RULE_open_tag);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 49;
	        this.match(PDMLParser.T__0);
	        this.state = 50;
	        this.match(PDMLParser.IDFR);
	        this.state = 54;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===22) {
	            this.state = 51;
	            this.match(PDMLParser.WS);
	            this.state = 56;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 66;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===16) {
	            this.state = 57;
	            this.valueAssignment();
	            this.state = 61;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===22) {
	                this.state = 58;
	                this.match(PDMLParser.WS);
	                this.state = 63;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 68;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 69;
	        this.match(PDMLParser.T__1);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	close_tag() {
	    let localctx = new Close_tagContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, PDMLParser.RULE_close_tag);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 71;
	        this.match(PDMLParser.T__2);
	        this.state = 72;
	        this.match(PDMLParser.IDFR);
	        this.state = 76;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===22) {
	            this.state = 73;
	            this.match(PDMLParser.WS);
	            this.state = 78;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 79;
	        this.match(PDMLParser.T__1);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	self_closing_tag() {
	    let localctx = new Self_closing_tagContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, PDMLParser.RULE_self_closing_tag);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 81;
	        this.match(PDMLParser.T__0);
	        this.state = 82;
	        this.match(PDMLParser.IDFR);
	        this.state = 86;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===22) {
	            this.state = 83;
	            this.match(PDMLParser.WS);
	            this.state = 88;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 98;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===16) {
	            this.state = 89;
	            this.valueAssignment();
	            this.state = 93;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===22) {
	                this.state = 90;
	                this.match(PDMLParser.WS);
	                this.state = 95;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 100;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 101;
	        this.match(PDMLParser.T__3);
	        this.state = 105;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,12,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 102;
	                this.match(PDMLParser.WS); 
	            }
	            this.state = 107;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,12,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	valueAssignment() {
	    let localctx = new ValueAssignmentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, PDMLParser.RULE_valueAssignment);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 108;
	        this.match(PDMLParser.IDFR);
	        this.state = 112;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===22) {
	            this.state = 109;
	            this.match(PDMLParser.WS);
	            this.state = 114;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 115;
	        this.match(PDMLParser.ASSIGN);
	        this.state = 119;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===22) {
	            this.state = 116;
	            this.match(PDMLParser.WS);
	            this.state = 121;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 122;
	        this.value();
	        this.state = 126;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,15,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 123;
	                this.match(PDMLParser.WS); 
	            }
	            this.state = 128;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,15,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	value() {
	    let localctx = new ValueContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, PDMLParser.RULE_value);
	    var _la = 0;
	    try {
	        this.state = 191;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 11:
	            localctx = new BoolLitContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 129;
	            this.match(PDMLParser.BOOL_LITERAL);
	            break;
	        case 20:
	            localctx = new NumLitContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 130;
	            this.match(PDMLParser.SIGNED_DOUBLE);
	            break;
	        case 9:
	            localctx = new StringLitContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 131;
	            this.match(PDMLParser.STRING_LITERAL);
	            break;
	        case 10:
	            localctx = new HexColourContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 132;
	            this.match(PDMLParser.HEX_COLOR);
	            break;
	        case 5:
	            localctx = new StructContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 133;
	            this.match(PDMLParser.T__4);
	            this.state = 137;
	            this._errHandler.sync(this);
	            var _alt = this._interp.adaptivePredict(this._input,16,this._ctx)
	            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	                if(_alt===1) {
	                    this.state = 134;
	                    this.match(PDMLParser.WS); 
	                }
	                this.state = 139;
	                this._errHandler.sync(this);
	                _alt = this._interp.adaptivePredict(this._input,16,this._ctx);
	            }

	            this.state = 153;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===16) {
	                this.state = 140;
	                this.valueAssignment();
	                this.state = 150;
	                this._errHandler.sync(this);
	                var _alt = this._interp.adaptivePredict(this._input,18,this._ctx)
	                while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	                    if(_alt===1) {
	                        this.state = 144;
	                        this._errHandler.sync(this);
	                        _la = this._input.LA(1);
	                        while(_la===22) {
	                            this.state = 141;
	                            this.match(PDMLParser.WS);
	                            this.state = 146;
	                            this._errHandler.sync(this);
	                            _la = this._input.LA(1);
	                        }
	                        this.state = 147;
	                        this.valueAssignment(); 
	                    }
	                    this.state = 152;
	                    this._errHandler.sync(this);
	                    _alt = this._interp.adaptivePredict(this._input,18,this._ctx);
	                }

	            }

	            this.state = 158;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===22) {
	                this.state = 155;
	                this.match(PDMLParser.WS);
	                this.state = 160;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 161;
	            this.match(PDMLParser.T__5);
	            break;
	        case 7:
	            localctx = new ArrayContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 162;
	            this.match(PDMLParser.T__6);
	            this.state = 166;
	            this._errHandler.sync(this);
	            var _alt = this._interp.adaptivePredict(this._input,21,this._ctx)
	            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	                if(_alt===1) {
	                    this.state = 163;
	                    this.match(PDMLParser.WS); 
	                }
	                this.state = 168;
	                this._errHandler.sync(this);
	                _alt = this._interp.adaptivePredict(this._input,21,this._ctx);
	            }

	            this.state = 182;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if((((_la) & ~0x1f) === 0 && ((1 << _la) & 1052320) !== 0)) {
	                this.state = 169;
	                this.value();
	                this.state = 179;
	                this._errHandler.sync(this);
	                var _alt = this._interp.adaptivePredict(this._input,23,this._ctx)
	                while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	                    if(_alt===1) {
	                        this.state = 173;
	                        this._errHandler.sync(this);
	                        _la = this._input.LA(1);
	                        while(_la===22) {
	                            this.state = 170;
	                            this.match(PDMLParser.WS);
	                            this.state = 175;
	                            this._errHandler.sync(this);
	                            _la = this._input.LA(1);
	                        }
	                        this.state = 176;
	                        this.value(); 
	                    }
	                    this.state = 181;
	                    this._errHandler.sync(this);
	                    _alt = this._interp.adaptivePredict(this._input,23,this._ctx);
	                }

	            }

	            this.state = 187;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===22) {
	                this.state = 184;
	                this.match(PDMLParser.WS);
	                this.state = 189;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 190;
	            this.match(PDMLParser.T__7);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

PDMLParser.EOF = antlr4.Token.EOF;
PDMLParser.T__0 = 1;
PDMLParser.T__1 = 2;
PDMLParser.T__2 = 3;
PDMLParser.T__3 = 4;
PDMLParser.T__4 = 5;
PDMLParser.T__5 = 6;
PDMLParser.T__6 = 7;
PDMLParser.T__7 = 8;
PDMLParser.STRING_LITERAL = 9;
PDMLParser.HEX_COLOR = 10;
PDMLParser.BOOL_LITERAL = 11;
PDMLParser.ASSIGN = 12;
PDMLParser.COMMENT = 13;
PDMLParser.SINGLE_COMMENT = 14;
PDMLParser.MULTI_COMMENT = 15;
PDMLParser.IDFR = 16;
PDMLParser.INT = 17;
PDMLParser.DOUBLE = 18;
PDMLParser.SIGNED_INT = 19;
PDMLParser.SIGNED_DOUBLE = 20;
PDMLParser.NUMBER = 21;
PDMLParser.WS = 22;

PDMLParser.RULE_grammarSpec = 0;
PDMLParser.RULE_body = 1;
PDMLParser.RULE_tag = 2;
PDMLParser.RULE_open_tag = 3;
PDMLParser.RULE_close_tag = 4;
PDMLParser.RULE_self_closing_tag = 5;
PDMLParser.RULE_valueAssignment = 6;
PDMLParser.RULE_value = 7;

class GrammarSpecContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_grammarSpec;
    }

	body() {
	    return this.getTypedRuleContext(BodyContext,0);
	};

	EOF() {
	    return this.getToken(PDMLParser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterGrammarSpec(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitGrammarSpec(this);
		}
	}


}



class BodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_body;
    }

	tag() {
	    return this.getTypedRuleContext(TagContext,0);
	};

	self_closing_tag() {
	    return this.getTypedRuleContext(Self_closing_tagContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitBody(this);
		}
	}


}



class TagContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_tag;
    }

	open_tag() {
	    return this.getTypedRuleContext(Open_tagContext,0);
	};

	close_tag() {
	    return this.getTypedRuleContext(Close_tagContext,0);
	};

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	body = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BodyContext);
	    } else {
	        return this.getTypedRuleContext(BodyContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterTag(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitTag(this);
		}
	}


}



class Open_tagContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_open_tag;
    }

	IDFR() {
	    return this.getToken(PDMLParser.IDFR, 0);
	};

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	valueAssignment = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ValueAssignmentContext);
	    } else {
	        return this.getTypedRuleContext(ValueAssignmentContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterOpen_tag(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitOpen_tag(this);
		}
	}


}



class Close_tagContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_close_tag;
    }

	IDFR() {
	    return this.getToken(PDMLParser.IDFR, 0);
	};

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterClose_tag(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitClose_tag(this);
		}
	}


}



class Self_closing_tagContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_self_closing_tag;
    }

	IDFR() {
	    return this.getToken(PDMLParser.IDFR, 0);
	};

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	valueAssignment = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ValueAssignmentContext);
	    } else {
	        return this.getTypedRuleContext(ValueAssignmentContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterSelf_closing_tag(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitSelf_closing_tag(this);
		}
	}


}



class ValueAssignmentContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_valueAssignment;
    }

	IDFR() {
	    return this.getToken(PDMLParser.IDFR, 0);
	};

	ASSIGN() {
	    return this.getToken(PDMLParser.ASSIGN, 0);
	};

	value() {
	    return this.getTypedRuleContext(ValueContext,0);
	};

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterValueAssignment(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitValueAssignment(this);
		}
	}


}



class ValueContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PDMLParser.RULE_value;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class StructContext extends ValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	valueAssignment = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ValueAssignmentContext);
	    } else {
	        return this.getTypedRuleContext(ValueAssignmentContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterStruct(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitStruct(this);
		}
	}


}

PDMLParser.StructContext = StructContext;

class StringLitContext extends ValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	STRING_LITERAL() {
	    return this.getToken(PDMLParser.STRING_LITERAL, 0);
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterStringLit(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitStringLit(this);
		}
	}


}

PDMLParser.StringLitContext = StringLitContext;

class HexColourContext extends ValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	HEX_COLOR() {
	    return this.getToken(PDMLParser.HEX_COLOR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterHexColour(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitHexColour(this);
		}
	}


}

PDMLParser.HexColourContext = HexColourContext;

class ArrayContext extends ValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(PDMLParser.WS);
	    } else {
	        return this.getToken(PDMLParser.WS, i);
	    }
	};


	value = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ValueContext);
	    } else {
	        return this.getTypedRuleContext(ValueContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterArray(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitArray(this);
		}
	}


}

PDMLParser.ArrayContext = ArrayContext;

class BoolLitContext extends ValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	BOOL_LITERAL() {
	    return this.getToken(PDMLParser.BOOL_LITERAL, 0);
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterBoolLit(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitBoolLit(this);
		}
	}


}

PDMLParser.BoolLitContext = BoolLitContext;

class NumLitContext extends ValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	SIGNED_DOUBLE() {
	    return this.getToken(PDMLParser.SIGNED_DOUBLE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.enterNumLit(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof PDMLListener ) {
	        listener.exitNumLit(this);
		}
	}


}

PDMLParser.NumLitContext = NumLitContext;


PDMLParser.GrammarSpecContext = GrammarSpecContext; 
PDMLParser.BodyContext = BodyContext; 
PDMLParser.TagContext = TagContext; 
PDMLParser.Open_tagContext = Open_tagContext; 
PDMLParser.Close_tagContext = Close_tagContext; 
PDMLParser.Self_closing_tagContext = Self_closing_tagContext; 
PDMLParser.ValueAssignmentContext = ValueAssignmentContext; 
PDMLParser.ValueContext = ValueContext; 
