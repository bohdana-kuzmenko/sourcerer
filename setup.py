import os

from setuptools import find_packages, setup


def get_version():
    basedir = os.path.dirname(__file__)
    with open(os.path.join(basedir, 'rq_dashboard/version.py')) as f:
        locals = {}
        exec(f.read(), locals)
        return locals['VERSION']
    raise RuntimeError('No version info found.')


# with open("README.md", "r") as fh:
#     long_description = fh.read()


setup(
    name='sourcerer',
    version='0.0.1',
    url='https://github.com/bohdana-kuzmenko/sourcerer',
    license='BSD',
    author='Bohdana Kuzmenko',
    author_email='bogdana.kuzmenko.16@gmail.com',
    description='',
    long_description="",
    long_description_content_type="text/markdown",
    packages=find_packages(),
    include_package_data=True,
    package_data={'': ['sourcerer/plugins/sourcerer_ui/*']},
    zip_safe=False,
    platforms='any',
    install_requires=[
        'boto3==1.26.8',
        'sqlalchemy==1.4.44',
        'sqlalchemy-utils==0.38.3',
        'pydantic==1.10.2',
        'pydantic_sqlalchemy==0.0.9',
        'alembic==1.8.1',
        'flask',
        'flask-restx',
        'fastapi',
        'uvicorn==0.20.0',
        'cryptography==38.0.4',
        'passlib',
        'bcrypt==4.0.1',
        'python-jose[cryptography]==3.3.0',
        'humanize',
        # 'blobbyappleconnect',
    ],
    entry_points={
        'console_scripts': [
            'sourcerer = sourcerer.cli:main'
        ]
    },
    classifiers=[
        # As from http://pypi.python.org/pypi?%3Aaction=list_classifiers
        # 'Development Status :: 1 - Planning',
        # 'Development Status :: 2 - Pre-Alpha',
        'Development Status :: 3 - Alpha',
        # 'Development Status :: 4 - Beta',
        # 'Development Status :: 5 - Production/Stable',
        # 'Development Status :: 6 - Mature',
        # 'Development Status :: 7 - Inactive',
        'Intended Audience :: Developers',
        'Intended Audience :: End Users/Desktop',
        'Intended Audience :: Information Technology',
        'Intended Audience :: Science/Research',
        'Intended Audience :: System Administrators',
        'License :: OSI Approved :: BSD License',
        'Operating System :: POSIX',
        'Operating System :: MacOS',
        'Operating System :: Unix',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Internet',
        'Topic :: Scientific/Engineering',
        'Topic :: System :: Distributed Computing',
        'Topic :: System :: Systems Administration',
        'Topic :: System :: Monitoring',
    ]
)
