class PDMLCompiler {
    compile(input) {
        const antlr4 = require('antlr4');
        const PDMLLexer = require('./PDMLLexer');
        const PDMLParser = require('./PDMLParser');

        // Parse input
        const chars = new antlr4.InputStream(input);
        const lexer = new PDMLLexer.PDMLLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new PDMLParser.PDMLParser(tokens);

        // Compile using PDMLCompiler
        const tree = parser.grammarSpec(); // Adjust root rule based on your grammar
        const result = this.visitGrammarSpec(tree);

        console.log(result); // Processed PDML tree

        return result;
    }

    visitGrammarSpec(ctx) {
        return this.visitBody(ctx.body());
    }

    visitBody(ctx) {
        if (ctx.tag() != null) {
            return this.visitTag(ctx.tag());
        } else if (ctx.self_closing_tag() != null) {
            return this.visitSelfClosingTag(ctx.self_closing_tag());
        }
        throw new Error("Invalid body structure.");
    }

    visitTag(ctx) {
        const tagName = ctx.open_tag().IDFR().getText();
        const body = new PDMLBody(tagName);

        // Parse attributes
        for (const valueCtx of ctx.open_tag().valueAssignment()) {
            const key = valueCtx.IDFR().getText();
            const value = this.visitValue(valueCtx.value());
            body.addAttribute(key, value);
        }

        // Parse children
        for (const childCtx of ctx.body()) {
            body.addChild(this.visitBody(childCtx));
        }

        return body;
    }

    visitSelfClosingTag(ctx) {
        const tagName = ctx.IDFR().getText();
        const body = new PDMLBody(tagName);

        // Parse attributes
        for (const valueCtx of ctx.valueAssignment()) {
            const key = valueCtx.IDFR().getText();
            const value = this.visitValue(valueCtx.value());
            body.addAttribute(key, value);
        }

        return body;
    }

    visitValue(ctx) {
        if (ctx instanceof PDMLParser.BoolLitContext) {
            return new PDMLBoolean(ctx.getText() === "true");
        } else if (ctx instanceof PDMLParser.NumLitContext) {
            return new PDMLNumber(parseFloat(ctx.getText()));
        } else if (ctx instanceof PDMLParser.StringLitContext) {
            const rawText = ctx.getText();
            return new PDMLString(rawText.substring(1, rawText.length - 1)); // Remove quotes
        } else if (ctx instanceof PDMLParser.HexColourContext) {
            return new PDMLHexColor(ctx.getText());
        } else if (ctx instanceof PDMLParser.StructContext) {
            const struct = new PDMLStruct();
            for (const valueCtx of ctx.valueAssignment()) {
                const key = valueCtx.IDFR().getText();
                const value = this.visitValue(valueCtx.value());
                struct.addField(key, value);
            }
            return struct;
        } else if (ctx instanceof PDMLParser.ArrayContext) {
            const array = new PDMLArray();
            for (const elementCtx of ctx.value()) {
                array.addElement(this.visitValue(elementCtx));
            }
            return array;
        }
        throw new Error("Unknown value type.");
    }

    visit(tree) {
        return tree.accept(this);
    }

    visitChildren(node) {
        // Default behavior: visit all children and return results
        const results = [];
        for (let i = 0; i < node.getChildCount(); i++) {
            const child = node.getChild(i);
            const result = child.accept(this);
            if (result !== null) results.push(result);
        }
        return results;
    }

    visitTerminal(terminalNode) {
        return terminalNode.getText();
    }

    visitErrorNode(errorNode) {
        throw new Error("Parsing error: " + errorNode.getText());
    }
}