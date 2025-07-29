# Description

This a reproduction repo for a ptoential bug in rsdoctor.

When running rsdoctor in multiplugin setup, with this config:

```ts
new RsdoctorRspackMultiplePlugin({
  name: config.target as "web" | "node",
  stage: index, // 0 | 1 | 2 ...
  mode: "brief",
  brief: {
    writeDataJson: true,
  },
});
```

Then the output for the two builds are messed up:

```
dist/
├── node/
│   └── .rsdoctor
│       ├── rsdoctor-report.html // <== This is the web builds report HTML
│       └── .slaves
│           └── node-3
│               ├── ... data files ...
│               ├── manifest.json // <== This is the node build's manifest.json
│               └── rsdoctor-report.html // <== This is the node builds report HTML!
└── web
    └── .rsdoctor
        ├── ... data files ...
        └── manifest.json // <== This is the web builds manifest.json
```

## Expected Behavior

The `dist/node` and `dist/web` folders should both contain a `rsdoctor-report.html` file, and the `manifest.json` file and should be identical in both folders.

```
dist/
├── node/
│   └── .rsdoctor
│       ├── ... data files ...
│       ├── manifest.json // <== This is the "node" build's manifest.json
│       └── rsdoctor-report.html // <== This is the "node" builds report HTML
└── web
    └── .rsdoctor
        ├── ... data files ...
        ├── manifest.json // <== This is the "web" build's manifest.json
        └── rsdoctor-report.html // <== This is the "web" builds report HTML
```

## Interesting notes

If you delete the `name` configuration from the plugin config but leave it on each config (checkout branch `no-plugin-name` to see), things do get better but not ideal.
result:

```
dist/
├── node/
│   └── .rsdoctor
│       └── .slaves
│           └── node
│               ├── ... data files ...
│               ├── manifest.json // <== This is the "node" build's manifest.json
│               └── rsdoctor-report.html // <== This is the "node" builds report HTML
└── web
    └── .rsdoctor
        ├── ... data files ...
        ├── manifest.json // <== This is the "web" build's manifest.json
        └── rsdoctor-report.html // <== This is the "web" builds report HTML
```

# Steps to Reproduce

1. Clone the repository.
2. Run `pnpm i`
3. Run `pnpm build`
4. inspect the two `dist` folders:
   - `dist/node`
   - `dist/web`
