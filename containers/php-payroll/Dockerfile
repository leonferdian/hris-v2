FROM php:8.2-apache

RUN apt-get update \
 && apt-get install -y gnupg unixodbc-dev libgssapi-krb5-2 \
 && rm -rf /var/lib/apt/lists/*

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/12/prod.list > /etc/apt/sources.list.d/mssql-release.list \
 && apt-get update \
 && ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 \
 && pecl install sqlsrv pdo_sqlsrv \
 && docker-php-ext-install mysqli \
 && docker-php-ext-enable sqlsrv pdo_sqlsrv mysqli

WORKDIR /var/www/html

COPY ./apache.conf /etc/apache2/conf-enabled/payroll.conf

RUN a2enmod rewrite

