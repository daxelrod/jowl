%global npm_name jowl

Name:           %{npm_name}
Version:        2.1.0
Release:        1%{?dist}
Summary:        CLI for JSON operations with Lodash

License:        MIT
URL:            https://jowl.app
Source0:        https://github.com/daxelrod/%{npm_name}/archive/refs/tags/v%{version}.tar.gz
# Also at       https://registry.npmjs.org/{npm_name}/-/{npm_name}-{version}.tgz
# however, npmjs.org has a build product which does not contain docs or tests
Source1:        %{npm_name}-%{version}-nm-prod.tgz
Source2:        %{npm_name}-%{version}-nm-dev.tgz
Source3:        %{npm_name}-%{version}-bundled-licenses.txt

BuildArch:      noarch
ExclusiveArch:  %{nodejs_arches} noarch
Requires:       nodejs
BuildRequires:  nodejs-devel
BuildRequires:  yarnpkg

%description
Jowl is a command-line filter for JSON expressions that uses plain JavaScript
with Lodash. It takes JSON on standard in, and writes pretty-printed JSON to
standard out.

%prep
%setup -q -n %{npm_name}-%{version}
cp %{SOURCE3} .
# Setup bundled runtime(prod) node modules
tar xfz %{SOURCE1}
mkdir -p node_modules
pushd node_modules
ln -s ../node_modules_prod/* .
ln -s ../node_modules_prod/.bin .
popd

%build
#nothing to do

%install
mkdir -p %{buildroot}%{nodejs_sitelib}/%{npm_name}
cp -pr package.json src/bin/jowl.js src/lib/ \
    %{buildroot}%{nodejs_sitelib}/%{npm_name}
# Copy over bundled nodejs modules
cp -pr node_modules node_modules_prod \
    %{buildroot}%{nodejs_sitelib}/%{npm_name}

mkdir -p %{buildroot}%{nodejs_sitelib}/%{npm_name}/bin
install -p -D -m0755 src/bin/jowl.js %{buildroot}%{nodejs_sitelib}/%{npm_name}/bin/jowl
mkdir -p %{buildroot}%{_bindir}
ln -sf %{nodejs_sitelib}/%{npm_name}/bin/jowl %{buildroot}%{_bindir}/jowl

# Fix the shebang because brp-mangle-shebangs fails to detect this properly (rhbz#1998924)
# This is fixed in fc36 and above
sed -e "s|^#!/usr/bin/env node$|#!/usr/bin/node|" \
    -i %{buildroot}%{nodejs_sitelib}/%{npm_name}/bin/jowl \
    -i %{buildroot}%{nodejs_sitelib}/%{npm_name}/jowl.js

%check
# Setup bundled dev node_modules for testing
#   Note: this cannot be in %%prep or the dev node_modules
#            can get pulled into the regular rpm
tar xfz %{SOURCE2}
# Ensure that this dir exists to be a target of the symlink
mkdir -p node_modules_prod/.bin
pushd node_modules
ln -s -f ../node_modules_dev/* .
popd
pushd node_modules/.bin
ln -s ../../node_modules_dev/.bin/* .
popd
# Run tests
yarn run test


%files
%doc docs/reference.md
%license LICENSE %{npm_name}-%{version}-bundled-licenses.txt
%{nodejs_sitelib}/%{npm_name}
%{_bindir}/jowl


%changelog
* Mon Sep 12 2022 Daniel Axelrod <fedora@danonline.net> - 2.1.0-1
- Package Jowl according to Fedora Packaging Guide
