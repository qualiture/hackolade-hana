# SAP HANA Cloud Plugin for Hackolade

> ⚠️ **WORK IN PROGRESS** - This plugin is for preview and evaluation purposes only. It is not ready for production use!

## About

This plugin enables SAP HANA Cloud as a target in [Hackolade Studio](https://hackolade.com) data modeling.

This project was inspired by the original [hackolade/hana](https://github.com/hackolade/hana) plugin, but aims to take it a step further with the following future improvements:

-   Native Node.js connectivity using `@sap/hana-client`
-   Full support for SAP HANA Cloud data types
-   Reverse engineering from live SAP HANA Cloud instances
-   Forward engineering to generate HANA DDL scripts

> ⚠️ **WORK IN PROGRESS** - This plugin is for preview and evaluation purposes only. It is not ready for production use!


## Prerequisites

-   [Hackolade Studio](https://hackolade.com/download.html) version 7.7.10 or higher
-   Access to a SAP HANA Cloud instance

## Installation

<!-- ### From Plugin Manager (when available)

1. Open Hackolade Studio
2. Go to **Help > Plugin Manager**
3. Search for "SAP HANA" and install -->

### Manual Installation

1. Download or clone this repository
2. Copy the plugin folder to your Hackolade plugins directory:
    - **Windows:** `%USERPROFILE%\.hackolade\plugins\hackolade-hana`
    - **macOS:** `~/.hackolade/plugins/hackolade-hana`
    - **Linux:** `~/.hackolade/plugins/hackolade-hana`
3. Restart Hackolade Studio

## Usage

### Creating a New Data Model

1. Open Hackolade Studio
2. Click **File > New Model**
3. Select **SAP HANA** from the target list
4. Start designing your data model with schemas, tables, columns, and relationships

### Reverse Engineering from SAP HANA Cloud

> ⚠️ **DOES NOT WORK** - Authentication not working

<!-- 1. Create a new SAP HANA model or open an existing one
2. Go to **Tools > Reverse-Engineer > Data source**
3. Enter your SAP HANA Cloud connection details:
    - **Host:** Your HANA Cloud hostname (e.g., `xxxxxxxx.hana.cloud.sap`)
    - **Port:** 443 (default for HANA Cloud)
    - **Username:** Your database user
    - **Password:** Your database password
4. Click **Test Connection** to verify connectivity
5. Select the schemas and tables you want to reverse engineer
6. Click **Apply** to import the data model -->

### Forward Engineering (DDL Generation)

> ⚠️ **DOES NOT WORK** - No HANA DDL parser built-in in Hackolade, cannot be provided via plugin it seems

<!-- 1. Design your data model in Hackolade
2. Go to **Tools > Forward-Engineer > DDL Script**
3. Select the scope (Model, Schema, or Entity level)
4. Review and export the generated DDL script -->

### Reverse Engineering from DDL Files

> ⚠️ **DOES NOT WORK** - No HANA DDL parser built-in in Hackolade, cannot be provided via plugin it seems

<!-- 1. Go to **Tools > Reverse-Engineer > Data Definition Language file**
2. Select **HANA** from the database dropdown
3. Choose your `.sql` DDL file
4. The plugin will parse and import the schema -->

## Supported Features

-   ✅ All SAP HANA Cloud data types (numeric, string, datetime, LOB, spatial, vector)
-   ✅ Tables with primary keys, unique constraints, and foreign keys
-   ✅ Views
-   ✅ Indexes
-   ✅ Schema-level organization
-   ✅ Comments on tables and columns
-   ❌ DDL script generation

## Known Limitations

-   **THIS IS A PREVIEW RELEASE** - expect many bugs and incomplete features
-   Some advanced HANA features may not be fully supported yet
-   DDL file import requires Hackolade's built-in SQL parser compatibility

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This plugin is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   Inspired by the original [hackolade/hana](https://github.com/hackolade/hana) plugin
-   Built with the [Hackolade Plugin Architecture](https://github.com/hackolade/plugins)
-   Uses [@sap/hana-client](https://www.npmjs.com/package/@sap/hana-client) for database connectivity
