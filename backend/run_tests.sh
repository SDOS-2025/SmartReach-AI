
echo "Activating conda environment..."
eval "$(conda shell.bash hook)"
export PYTHONWARNINGS="ignore"
conda activate SDOS_env

echo "Using test settings: backend.test_settings"
echo ""

declare -a TEST_CLASSES=(
    "LoginTests"
    "LogoutTests"
    "SignupTests"
    "OAuthAuthCompleteTests"
    "GetEmailTests"
    "CompanyUserTests"
    "ModelConstraintsTests"
)

for test_class in "${TEST_CLASSES[@]}"; do
    echo "=========================="
    echo " Running $test_class "
    echo "=========================="
    python -W ignore manage.py test api.tests.$test_class --settings=backend.test_settings --keepdb
    echo ""
done

echo "All tests completed"