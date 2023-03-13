// Copyright (c) Jupyter Development Team, Spyder Project Contributors.
// Distributed under the terms of the Modified BSD License.

// This file is based on the corresponding file in Jupyter Notebook.

import {
  IRouter,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IDocumentManager } from '@jupyterlab/docmanager';

/**
 * A regular expression to match path to notebooks and documents
 *
 * Adapted to use the URL from Spyder
 */
// Spyder: Use 'spyder-notebooks' instead of 'notebooks'
const TREE_PATTERN = new RegExp('/(spyder-notebooks)/(.*)');

/**
 * A plugin to open documents in the main area.
 *
 * The code is identical to the code in Jupyter Notebook, but it
 * uses a different value for TREE_PATTERN.
 */
const opener: JupyterFrontEndPlugin<void> = {
  id: '@spyder-notebook/application-extension:opener',
  autoStart: true,
  requires: [IRouter, IDocumentManager],
  activate: (
    app: JupyterFrontEnd,
    router: IRouter,
    docManager: IDocumentManager
  ): void => {
    const { commands } = app;

    const command = 'router:tree';
    commands.addCommand(command, {
      execute: (args: any) => {
        const parsed = args as IRouter.ILocation;
        const matches = parsed.path.match(TREE_PATTERN) ?? [];
        const [, , path] = matches;
        if (!path) {
          return;
        }

        const file = decodeURIComponent(path);
        const urlParams = new URLSearchParams(parsed.search);
        const factory = urlParams.get('factory') ?? 'default';
        app.started.then(async () => {
          docManager.open(file, factory, undefined, {
            ref: '_noref'
          });
        });
      }
    });

    router.register({ command, pattern: TREE_PATTERN });
  }
};

/**
 * Export the plugins as default.
 */
const plugins: JupyterFrontEndPlugin<any>[] = [
  opener
];

export default plugins;
