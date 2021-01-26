/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {NodeKey} from 'outline';

import {BlockNode, TextNode} from 'outline';

const HAS_DIRECTION = 1 << 2;

export class ParagraphNode extends BlockNode {
  type: 'paragraph';

  constructor(key?: NodeKey) {
    super(key);
    this.type = 'paragraph';
  }

  clone(): ParagraphNode {
    const clone = new ParagraphNode(this.key);
    clone.children = [...this.children];
    clone.parent = this.parent;
    clone.flags = this.flags;
    return clone;
  }

  // View

  createDOM(): HTMLElement {
    return document.createElement('p');
  }
  updateDOM(prevNode: ParagraphNode, dom: HTMLElement): boolean {
    return false;
  }

  // Mutation

  mergeWithPreviousSibling(): void {
    const prevBlock = this.getPreviousSibling();
    if (prevBlock !== null) {
      super.mergeWithPreviousSibling();
      return;
    }
    // Otherwise just reset the text node flags
    const firstChild = this.getFirstChild();
    if (firstChild instanceof TextNode) {
      firstChild.setFlags(HAS_DIRECTION);
    }
  }

  mergeWithNextSibling(): void {
    const nextBlock = this.getNextSibling();
    if (nextBlock !== null) {
      super.mergeWithNextSibling();
      return;
    }
    // Otherwise just reset the text node flags
    const firstChild = this.getFirstChild();
    if (firstChild instanceof TextNode) {
      firstChild.setFlags(HAS_DIRECTION);
    }
  }

  insertNewAfter(): ParagraphNode {
    const newBlock = createParagraphNode();
    this.insertAfter(newBlock);
    return newBlock;
  }
}

export function createParagraphNode(): ParagraphNode {
  const paragraph = new ParagraphNode();
  // Paragraph nodes align with text direection
  paragraph.makeDirectioned();
  return paragraph;
}